import map from 'ramda/src/map'
import path from 'ramda/src/path'
import assocPath from 'ramda/src/assocPath'
import values from 'ramda/src/values'

import invariant from 'invariant'
import React from 'react'
import PropTypes from 'prop-types'
import { EventEmitter } from 'events'
import { fromJS, Record, List } from 'immutable'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/bufferTime'
import 'rxjs/add/observable/fromEvent'

/* Internal modules */
import {
  defaultDebounceTime,
  ValidationRulesPropType,
  ValidationMessagesPropType,
} from './FormProvider'
import {
  CustomPropTypes,
  isset,
  camelize,
  dispatch,
  flattenDeep,
  recordUtils,
  fieldUtils,
  formUtils,
  rxUtils,
} from '../utils'
import * as handlers from '../utils/handlers'
import validate from '../utils/handlers/validateField'

/**
 * Binds the component's reference to the function's context and calls
 * an optional callback function to access the component reference.
 * @param {HTMLElement} element
 * @param {Function?} callback
 */
function getInnerRef(element, callback) {
  this.innerRef = element

  if (callback) {
    callback(element)
  }
}

const isField = (entry) => {
  return !!entry.fieldPath
}

export default class Form extends React.Component {
  static propTypes = {
    /* General */
    innerRef: PropTypes.func,
    action: PropTypes.func.isRequired,
    initialValues: PropTypes.object,

    /* Validation */
    rules: ValidationRulesPropType,
    messages: ValidationMessagesPropType,

    /* Callbacks */
    onFirstChange: PropTypes.func,
    onReset: PropTypes.func,
    onSerialize: PropTypes.func,
    onInvalid: PropTypes.func,
    onSubmitStart: PropTypes.func,
    onSubmitted: PropTypes.func,
    onSubmitFailed: PropTypes.func,
    onSubmitEnd: PropTypes.func,
  }

  static defaultProps = {
    action: () => new Promise((resolve) => resolve()),
  }

  state = {
    fields: {},
    rxRules: {},
    dirty: false,
  }

  /* Context accepted by the Form */
  static contextTypes = {
    rules: PropTypes.object,
    messages: CustomPropTypes.Map,
    debounceTime: PropTypes.number,
    withImmutable: PropTypes.bool,
  }

  /* Context propagated to the fields */
  static childContextTypes = {
    fields: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
  }

  getChildContext() {
    return {
      fields: this.state.fields,
      form: this,
    }
  }

  constructor(props, context) {
    super(props, context)
    const { rules: explicitRules, messages: explicitMessages } = props
    const { debounceTime, rules, messages } = context

    /* Set the validation debounce duration */
    this.debounceTime = isset(debounceTime) ? debounceTime : defaultDebounceTime

    /* Set validation rules */
    this.formRules = formUtils.mergeRules(explicitRules, rules)

    /**
     * Define validation messages once, since those should be converted
     * to immutable, which is an expensive procedure. Moreover, messages
     * are unlikely to change during the component's lifecycle. It should
     * be safe to store them.
     * Note: Messages passed from FormProvider (context messages) are
     * already immutable.
     */
    this.messages = explicitMessages ? fromJS(explicitMessages) : messages

    /* Create an event emitter to communicate between form and its fields */
    const eventEmitter = new EventEmitter()
    this.eventEmitter = eventEmitter

    /* Field lifecycle observerables */
    Observable.fromEvent(eventEmitter, 'fieldRegister')
      .bufferTime(100)
      .subscribe((pendingFields) => pendingFields.forEach(this.registerField))
    Observable.fromEvent(eventEmitter, 'fieldFocus').subscribe(this.handleFieldFocus)
    Observable.fromEvent(eventEmitter, 'fieldChange').subscribe(this.handleFieldChange)
    Observable.fromEvent(eventEmitter, 'fieldBlur').subscribe(this.handleFieldBlur)
    Observable.fromEvent(eventEmitter, 'fieldUnregister').subscribe(this.unregisterField)
    Observable.fromEvent(eventEmitter, 'validateField').subscribe(this.validateField)
  }

  withRegisteredField = (func) => {
    return (args) => {
      const { fieldProps } = args
      const includesField = path(fieldProps.fieldPath, this.state.fields)
      return includesField && func(args)
    }
  }

  /**
   * Maps the field to the state/context.
   * Passing fields in context gives a benefit of removing an explicit traversing of
   * children tree, deconstructing and constructing each appropriate child with the
   * attached handler props.
   * @param {Record} fieldProps
   */
  registerField = ({ fieldProps: initialFieldProps, fieldOptions }) => {
    const { fields } = this.state
    const { fieldPath } = initialFieldProps
    const fieldAlreadyExists = path(fieldPath, fields)

    /* Warn on field duplicates */
    invariant(
      !(fieldAlreadyExists && !fieldOptions.allowMultiple),
      'Cannot register field `%s`, the field with ' +
        'the provided name is already registered. Make sure the fields on the same level of `Form` ' +
        'or `Field.Group` have unique names.',
      fieldPath,
    )

    /* Perform custom field props transformations upon registration */
    const fieldProps = fieldOptions.beforeRegister({
      fieldProps: initialFieldProps,
      fields,
    })

    if (!fieldProps) {
      return
    }

    const nextFields = assocPath(fieldPath, fieldProps, fields)
    const { eventEmitter } = this

    /**
     * Synchronize the field record with the field component's props.
     * Create a props change observer to keep field's record in sync with
     * the props changes of the respective field component. Only the changes
     * in the props relative to the record should be observed and synchronized.
     */
    rxUtils
      .createPropsObserver({
        targetFieldPath: fieldPath,
        props: ['type'],
        eventEmitter,
      })
      .subscribe(({ nextTargetRecord, changedProps }) => {
        //
        // TODO Test if this replaces the previous logic.
        //
        const nextFieldProps = nextTargetRecord.merge(changedProps)
        this.updateFieldsWith(nextFieldProps)

        // this.updateField({
        //   fieldPath,
        //   update: (fieldProps) =>
        //     Object.keys(changedProps).reduce((acc, propName) => {
        //       return acc.set(propName, changedProps[propName])
        //     }, fieldProps),
        // })
      })

    /**
     * Analyze the rules relevant to the registered field and create
     * reactive subscriptions to resolve them once their dependencies
     * update. Returns the Map of the recorded formatted rules.
     * That Map is later used during the sync validation as the rules source.
     */
    const nextRxRules = rxUtils.createRulesSubscriptions({
      fieldProps,
      fields,
      form: this,
    })

    this.setState(
      {
        fields: nextFields,
        rxRules: nextRxRules,
      },
      () => {
        const fieldRegisteredEvent = camelize(...fieldPath, 'registered')
        eventEmitter.emit(fieldRegisteredEvent, fieldProps)

        if (fieldOptions.shouldValidateOnMount) {
          this.validateField({
            fieldProps,

            /**
             * Enforce the validation function to use the "fieldProps"
             * provided directly. By default, it will try to grab the
             * field record from the state, which is missing at the
             * point of field mounting.
             */
            forceProps: true,
          })
        }

        /* Create reactive props subscriptions */
        rxUtils.createPropsSubscriptions({
          fieldProps,
          fields: nextFields,
          form: this,
        })
      },
    )
  }

  /**
   * Updates the fields with the given field record and returns
   * the updated state of the fields.
   * @param {Record} fieldProps
   * @returns {Promise}
   */
  updateFieldsWith = (fieldProps) => {
    const nextFields = recordUtils.updateCollectionWith(fieldProps, this.state.fields)

    return new Promise((resolve, reject) => {
      try {
        this.setState({ fields: nextFields }, resolve.bind(this, nextFields))
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Deletes the field record from the state.
   * @param {Record} fieldProps
   */
  unregisterField = (fieldProps) => {
    this.setState((prevState) => ({
      fields: prevState.fields.deleteIn(fieldProps.fieldPath),
    }))
  }

  /**
   * Handles the first change of a field value.
   * @param {Event} event
   * @param {any} nextValue
   * @param {any} prevValue
   * @param {Record} fieldProps
   */
  handleFirstChange = ({ event, prevValue, nextValue, fieldProps }) => {
    dispatch(
      this.props.onFirstChange,
      {
        event,
        nextValue,
        prevValue,
        fieldProps,
        fields: this.state.fields,
        form: this,
      },
      this.context,
    )

    this.setState({ dirty: true })
  }

  /**
   * Handles field focus.
   * @param {Event} event
   * @param {Record} fieldProps
   */
  handleFieldFocus = this.withRegisteredField((args) => {
    const { fields } = this.state
    const { nextFields } = handlers.handleFieldFocus(args, fields, this)
    this.setState({ fields: nextFields })
  })

  /**
   * Handles field change.
   * @param {Event} event
   * @param {Record} fieldProps
   * @param {mixed} prevValue
   * @param {mixed} nextValue
   */
  handleFieldChange = this.withRegisteredField(async (args) => {
    const { fields, dirty } = this.state

    const changePayload = await handlers.handleFieldChange(args, fields, this, {
      onUpdateValue: this.updateFieldsWith,
    })

    /**
     * Change handler for controlled fields does not return the next field props
     * record, therefore, need to explicitly ensure the payload was returned.
     */
    if (changePayload) {
      this.updateFieldsWith(changePayload.nextFieldProps)
    }

    /* Mark form as dirty if it's not already */
    if (!dirty) {
      this.handleFirstChange(args)
    }
  })

  /**
   * Handles field blur.
   * @param {Event} event
   * @param {Record} fieldProps
   */
  handleFieldBlur = this.withRegisteredField(async (args) => {
    const { fields } = this.state
    const { nextFields } = await handlers.handleFieldBlur(args, fields, this)

    this.setState({ fields: nextFields })
  })

  /**
   * Validates the provided field with the additional options.
   */
  validateField = async (args) => {
    const {
      chain,
      force = false,
      fieldProps: explicitFieldProps,
      fields: explicitFields,
      forceProps = false,
      shouldUpdateFields = true,
    } = args

    const fields = explicitFields || this.state.fields

    console.warn('validation')
    console.log({ explicitFieldProps })
    console.log({ fields })

    let fieldProps = forceProps ? explicitFieldProps : path(explicitFieldProps.fieldPath, fields)
    fieldProps = fieldProps || explicitFieldProps

    console.log({ fieldProps })

    /* Perform the validation */
    const validatedField = await validate({
      chain,
      force,
      fieldProps,
      fields,
      form: this,
    })

    /* Update the field in the state to reflect the changes */
    if (shouldUpdateFields) {
      await this.updateFieldsWith(validatedField)
    }

    return validatedField
  }

  /**
   * Performs the validation of each field in parallel, awaiting for all the pending
   * validations to be completed.
   * @param {Function} predicate (Optional) Predicate function to filter the fields.
   */
  validate = async (predicate = isField) => {
    const { fields } = this.state

    console.warn('validate')
    console.log('mutable fields:', fields)

    const flatFields = flattenDeep(fields, predicate, true)

    console.log({ flatFields })

    /* Map pending field validations into a list */
    const pendingValidations = map(
      (fieldProps) => this.validateField({ fieldProps }),
      values(flatFields),
    )

    // const pendingValidations = flatFields.reduce(
    //   (validations, fieldProps) => {
    //     return validations.concat(this.validateField({ fieldProps }))
    //   },
    //   [],
    // )

    /* Await for all validation promises to resolve before returning */
    const validatedFields = await Promise.all(pendingValidations)
    const isFormValid = validatedFields.every((validatedFieldProps) => {
      return validatedFieldProps.expected
    })

    const { onInvalid } = this.props

    if (!isFormValid && onInvalid) {
      const { fields: nextFields } = this.state

      /* Filter unexpected fields into a separate collection */
      const invalidFields = List(nextFields.filterNot((fieldProps) => fieldProps.expected))

      /* Call custom callback */
      dispatch(
        onInvalid,
        {
          fields: nextFields,
          invalidFields,
          form: this,
        },
        this.context,
      )
    }

    return isFormValid
  }

  /**
   * Clears all the fields.
   */
  clear = () => {
    const nextFields = map(fieldUtils.resetField(() => ''), this.state.fields)
    this.setState({ fields: nextFields })
  }

  /**
   * Resets all the fields to their initial state upon mounting.
   */
  reset = () => {
    const nextFields = map(recordUtils.reset, this.state.fields)

    this.setState({ fields: nextFields }, () => {
      /**
       * Validate only non-empty fields, since empty required fields
       * should not be unexpected after reset.
       */
      this.validate((entry) => Record.isRecord(entry) && entry.value !== '')

      /* Call custom callback methods to be able to reset controlled fields */
      dispatch(
        this.props.onReset,
        {
          fields: nextFields,
          form: this,
        },
        this.context,
      )
    })
  }

  /**
   * Returns a collection of serialized fields.
   * @returns {Object}
   */
  serialize = () => {
    const { fields } = this.state
    const { onSerialize } = this.props

    const serialized = fieldUtils.serializeFields(fields)
    return onSerialize
      ? onSerialize({
          serialized,
          fields,
          form: this,
        })
      : serialized
  }

  /**
   * Submits the form.
   * @param {Event} event
   */
  submit = async (event) => {
    if (event) {
      event.preventDefault()
    }

    /* Throw on submit attempt without the "action" prop */
    const { action } = this.props

    invariant(
      action,
      'Cannot submit the form without `action` prop specified explicitly. ' +
        'Expected a function which returns Promise, but received: %s.',
      action,
    )

    /* Ensure form is valid before submitting */
    const isFormValid = await this.validate()

    if (!isFormValid) {
      return
    }

    const { fields } = this.state
    const { onSubmitStart, onSubmitted, onSubmitFailed, onSubmitEnd } = this.props

    /* Serialize the fields */
    const serialized = this.serialize()

    /* Compose a single Object of arguments passed to each custom handler */
    const callbackArgs = {
      serialized,
      fields,
      form: this,
    }

    /**
     * Event: Submit has started.
     * The submit is consideres started immediately when the submit button is pressed.
     */
    dispatch(onSubmitStart, callbackArgs, this.context)

    const dispatchedAction = dispatch(action, callbackArgs, this.context)

    invariant(
      dispatchedAction && typeof dispatchedAction.then === 'function',
      'Cannot submit the form. Expected `action` prop of the Form to return ' +
        'an instance of Promise, but got: %s. Make sure you return a Promise ' +
        'from your action handler.',
      dispatchedAction,
    )

    return dispatchedAction
      .then((res) => {
        dispatch(onSubmitted, { ...callbackArgs, res }, this.context)
        return res
      })
      .catch((res) => {
        dispatch(onSubmitFailed, { ...callbackArgs, res }, this.context)
        return res
      })
      .then((res) => {
        dispatch(onSubmitEnd, { ...callbackArgs, res }, this.context)
      })
  }

  render() {
    const { innerRef, id, className, children } = this.props

    return (
      <form
        ref={(ref) => getInnerRef.call(this, ref, innerRef)}
        {...{ id }}
        {...{ className }}
        onSubmit={this.submit}
        noValidate
      >
        {children}
      </form>
    )
  }
}
