import * as R from 'ramda'

import invariant from 'invariant'
import React from 'react'
import PropTypes from 'prop-types'
import { EventEmitter } from 'events'
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
  isset,
  camelize,
  dispatch,
  recordUtils,
  fieldUtils,
  formUtils,
  rxUtils,
} from '../utils'
import * as handlers from '../utils/handlers'
import validate from '../utils/handlers/validateField'
import getLeavesWhich from '../utils/getLeaves'

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
    applicableRules: {},
    dirty: false,
  }

  /* Context accepted by the Form */
  static contextTypes = {
    rules: PropTypes.object,
    messages: PropTypes.object,
    debounceTime: PropTypes.number,
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
    const { debounceTime, rules: contextRules, messages } = context

    /* Set the validation debounce duration */
    this.debounceTime = isset(debounceTime) ? debounceTime : defaultDebounceTime

    /* Set validation rules */
    this.validationSchema = formUtils.mergeRules(explicitRules, contextRules)

    //
    // TODO
    // Consider moving this to the form's state.
    //
    this.messages = explicitMessages || messages

    /* Create an event emitter to communicate between form and its fields */
    const eventEmitter = new EventEmitter()
    this.eventEmitter = eventEmitter

    /* Field events observerables */
    Observable.fromEvent(eventEmitter, 'fieldRegister')
      .bufferTime(100)
      .subscribe((pendingFields) => pendingFields.forEach(this.registerField))
    Observable.fromEvent(eventEmitter, 'fieldFocus').subscribe(
      this.handleFieldFocus,
    )
    Observable.fromEvent(eventEmitter, 'fieldChange').subscribe(
      this.handleFieldChange,
    )
    Observable.fromEvent(eventEmitter, 'fieldBlur').subscribe(
      this.handleFieldBlur,
    )
    Observable.fromEvent(eventEmitter, 'fieldUnregister').subscribe(
      this.unregisterField,
    )
    Observable.fromEvent(eventEmitter, 'validateField').subscribe(
      this.validateField,
    )
  }

  /**
   * Wraps a given function, ensuring its invocation only when the payload
   * of that function has a field that is a part of the form's fields.
   */
  withRegisteredField = (func) => {
    return (args) => {
      const includesField = R.path(args.fieldProps.fieldPath, this.state.fields)
      return includesField && func(args)
    }
  }

  /**
   * Maps the field to the state.
   * Passing fields in context gives a benefit of removing an explicit traversing of
   * children tree, deconstructing and constructing each appropriate child with the
   * attached handler props.
   * @param {Object} fieldProps
   */
  registerField = ({ fieldProps: initialFieldProps, fieldOptions }) => {
    const { fields } = this.state
    const { fieldPath } = initialFieldProps
    const fieldAlreadyExists = !!R.path(fieldPath, fields)

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

    const nextFields = R.assocPath(fieldPath, fieldProps, fields)
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
    const nextApplicableRules = rxUtils.createRulesSubscriptions({
      fieldProps,
      fields,
      form: this,
    })

    this.setState(
      {
        fields: nextFields,
        applicableRules: nextApplicableRules,
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
   * @param {Object} fieldProps
   * @returns {Promise}
   */
  updateFieldsWith = (fieldProps) => {
    const nextFields = recordUtils.updateCollectionWith(
      fieldProps,
      this.state.fields,
    )

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
   * @param {Object} fieldProps
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
   * @param {Object} fieldProps
   */
  handleFirstChange = ({ event, prevValue, nextValue, fieldProps }) => {
    dispatch(this.props.onFirstChange, {
      event,
      nextValue,
      prevValue,
      fieldProps,
      fields: this.state.fields,
      form: this,
    })

    this.setState({ dirty: true })
  }

  /**
   * Handles field focus.
   * @param {Event} event
   * @param {Object} fieldProps
   */
  handleFieldFocus = this.withRegisteredField((args) => {
    const { fields } = this.state
    const { nextFields } = handlers.handleFieldFocus(args, fields, this)
    this.setState({ fields: nextFields })
  })

  /**
   * Handles field change.
   * @param {Event} event
   * @param {Object} fieldProps
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
   * @param {Object} fieldProps
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

    let fieldProps = forceProps
      ? explicitFieldProps
      : R.path(explicitFieldProps.fieldPath, fields)
    fieldProps = fieldProps || explicitFieldProps

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
   */
  validate = async (predicate = R.T) => {
    const { fields } = this.state
    const flattenedFields = getLeavesWhich(
      R.allPass([R.is(Object), R.has('fieldPath'), predicate]),
      fields,
    )

    /* Map pending field validations into a list */
    const pendingValidations = flattenedFields.map((fieldProps) =>
      this.validateField({ fieldProps }),
    )

    /* Await for all validation promises to resolve before returning */
    const validatedFields = await Promise.all(pendingValidations)
    const isFormValid = validatedFields.every(R.propEq('expected', true))

    const { onInvalid } = this.props

    if (!isFormValid && onInvalid) {
      const { fields: nextFields } = this.state

      /* Get a map of invalid fields */
      const invalidFields = validatedFields.filter(R.propEq('expected', false))

      /* Call custom callback */
      dispatch(onInvalid, {
        invalidFields,
        fields: nextFields,
        form: this,
      })
    }

    return isFormValid
  }

  /**
   * Resets all the fields to their initial state upon mounting.
   */
  reset = () => {
    const nextFields = R.map(recordUtils.reset, this.state.fields)

    this.setState({ fields: nextFields }, () => {
      /**
       * Invoke form validation with the predicate that omits empty fields,
       * regardless of their required status. That is to prevent having
       * invalid empty required fields after reset.
       */
      this.validate(
        R.allPass([R.has('value'), R.complement(R.propEq('value', ''))]),
      )

      /* Callback method to reset controlled fields */
      dispatch(this.props.onReset, {
        fields: nextFields,
        form: this,
      })
    })
  }

  /**
   * Clears all the fields.
   */
  clear = () => {
    const nextFields = R.map(fieldUtils.resetField(() => ''), this.state.fields)
    this.setState({ fields: nextFields })
  }

  /**
   * Returns a collection of serialized fields.
   * @returns {Object}
   */
  serialize = () => {
    const { fields } = this.state
    const { onSerialize } = this.props

    const serialized = fieldUtils.serializeFields(fields)
    console.log('serialized:', serialized)

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
    const {
      onSubmitStart,
      onSubmitted,
      onSubmitFailed,
      onSubmitEnd,
    } = this.props

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
     * The submit is considered started immediately when the submit button is pressed.
     */
    dispatch(onSubmitStart, callbackArgs)

    const pendingSubmit = dispatch(action, callbackArgs)

    invariant(
      pendingSubmit && typeof pendingSubmit.then === 'function',
      'Cannot submit the form. Expected `action` prop of the Form to return ' +
        'an instance of Promise, but got: %s. Make sure you return a Promise ' +
        'from your action handler.',
      pendingSubmit,
    )

    return pendingSubmit
      .then((res) => {
        dispatch(onSubmitted, { ...callbackArgs, res })
        return res
      })
      .catch((res) => {
        dispatch(onSubmitFailed, { ...callbackArgs, res })
        return res
      })
      .then((res) => {
        dispatch(onSubmitEnd, { ...callbackArgs, res })
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
