import * as R from 'ramda'
import invariant from 'invariant'
import React from 'react'
import PropTypes from 'prop-types'
import { EventEmitter } from 'events'
import { Observable } from 'rxjs/internal/Observable'
import { fromEvent } from 'rxjs/internal/observable/fromEvent'
import { bufferTime } from 'rxjs/internal/operators/bufferTime'
import { filter } from 'rxjs/internal/operators/filter'

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
  evolveP,
  recordUtils,
  fieldUtils,
  formUtils,
  rxUtils,
} from '../utils'
import * as handlers from '../utils/handlers'
import validate from '../utils/handlers/validateField'
import getLeavesWhich from '../utils/getLeavesWhich'
import deriveDeepWith from '../utils/deriveDeepWith'

/**
 * Binds the component's reference to the function's context and calls
 * an optional callback function to access the component reference.
 * @param {HTMLElement} element
 * @param {Function?} callback
 */
function bindInnerRef(element, callback) {
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
    onClear: PropTypes.func,
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
    const { rules: formRules, messages: explicitMessages } = props
    const { debounceTime, rules: providerRules, messages } = context

    if (this.props.hasOwnProperty('withImmutable')) {
      console.warn(
        'FormProvider: `withImmutable` prop has been deprecated. Please remove it and treat exposed library ' +
          'instances as plain JavaScript data types. See more details: https://goo.gl/h5YUiS',
      )
    }

    /* Set the validation debounce duration */
    this.debounceTime = isset(debounceTime) ? debounceTime : defaultDebounceTime

    /**
     * @todo Consider moving this to the form's state.
     */
    this.messages = explicitMessages || messages

    /* Create an event emitter to communicate between form and its fields */
    const eventEmitter = new EventEmitter()
    this.eventEmitter = eventEmitter

    /* Field events observerables */
    fromEvent(eventEmitter, 'fieldsDidUpdate').subscribe(this.fieldsDidUpdate)
    fromEvent(eventEmitter, 'fieldRegister')
      .pipe(bufferTime(50))
      .subscribe((pendingFields) => pendingFields.forEach(this.registerField))

    fromEvent(eventEmitter, 'fieldFocus').subscribe(this.handleFieldFocus)
    fromEvent(eventEmitter, 'fieldChange').subscribe(this.handleFieldChange)
    fromEvent(eventEmitter, 'fieldBlur').subscribe(this.handleFieldBlur)
    fromEvent(eventEmitter, 'validateField').subscribe(this.validateField)
    fromEvent(eventEmitter, 'fieldUnregister')
      .pipe(
        bufferTime(50),
        filter(R.complement(R.isEmpty)),
      )
      .subscribe(this.unregisterFields)

    this.state = {
      dirty: false,
      fields: {},
      rules: formUtils.mergeRules(formRules, providerRules),
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { rules: prevFormRules } = this.props
    const { rules: nextFormRules } = nextProps
    const { rules: prevProviderRules } = this.context
    const { rules: nextProviderRules } = nextContext

    const shouldUpdateState = !(
      R.equals(nextFormRules, prevFormRules) &&
      R.equals(nextProviderRules, prevProviderRules)
    )

    if (shouldUpdateState) {
      const nextRules = formUtils.mergeRules(nextFormRules, nextProviderRules)

      /**
       * Reset the validity and validation state of all fields
       * to reset those which rules are no longer present in the
       * schema from the next props.
       * @todo A good optimization place. May be refined.
       */
      const nextFields = R.compose(
        fieldUtils.stitchFields,
        R.map(
          R.compose(
            recordUtils.resetValidationState,
            recordUtils.resetValidityState,
          ),
        ),
        fieldUtils.flattenFields,
      )(this.state.fields)

      this.setState({
        fields: nextFields,
        rules: nextRules,
      })
    }
  }

  componentWillUnmount() {
    this.eventEmitter.removeAllListeners()
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
   * Registers a new field in the form's state.
   * @param {Object} fieldProps
   * @param {Object} fieldOptions
   */
  registerField = ({ fieldProps: pristineFieldProps, fieldOptions }) => {
    const { fields } = this.state
    const { fieldPath } = pristineFieldProps
    const fieldAlreadyExists = !!R.path(fieldPath, fields)

    invariant(
      !(fieldAlreadyExists && !fieldOptions.allowMultiple),
      'Cannot register field `%s`, the field with ' +
        'the provided name is already registered. Make sure the fields on the same level of `Form` ' +
        'or `Field.Group` have unique names.',
      fieldPath,
    )

    /* Perform custom field props transformations upon registration */
    const fieldProps = fieldOptions.beforeRegister({
      fieldProps: pristineFieldProps,
      fields,
    })

    /**
     * Field registration may be explicitly prevented if "beforeRegister" method
     * returns null. This is useful to control mounting of complex fields (i.e. radio).
     */
    if (!fieldProps) {
      return
    }

    /**
     * Assume the next state of the fields with the newly registered field
     * set in the fields map.
     */
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
        /**
         * @todo Verify that this replaces the previous logic.
         */
        R.compose(
          this.updateFieldsWith,
          R.mergeDeepRight(nextTargetRecord),
        )(changedProps)

        // this.updateField({
        //   fieldPath,
        //   update: (fieldProps) =>
        //     Object.keys(changedProps).reduce((acc, propName) => {
        //       return acc.set(propName, changedProps[propName])
        //     }, fieldProps),
        // })
      })

    /**
     * Create observables for each reactive rule applicable to the
     * currently registered field.
     * @todo Flush obsolete observables to prevent memory leak.
     */
    rxUtils.createRulesSubscriptions({
      fieldProps,
      fields,
      rules: this.state.rules,
      form: this,
    })

    this.setState({ fields: nextFields }, () => {
      const fieldRegisteredEvent = camelize(...fieldPath, 'registered')
      eventEmitter.emit(fieldRegisteredEvent, fieldProps)

      if (fieldOptions.shouldValidateOnMount) {
        this.validateField({
          fieldProps,

          /**
           * Enforce the validation function to use the "fieldProps"
           * provided directly. By default, it will try to grab the
           * field record from the state, which does not exist at
           * the point of new field mounting.
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
    })
  }

  /**
   * Updates the fields with the given patch, which includes field's path
   * and its next "raw" value. Any additional "mapValue" transformations
   * are applied to the next value.
   * @param {Object<fieldPath: nextValue>} fieldsPatch
   */
  setValues = async (fieldsPatch) => {
    const { fields } = this.state
    const transformers = deriveDeepWith(
      (_, nextValue, fieldProps) =>
        R.compose(
          (fieldProps) =>
            validate({
              fieldProps,
              fields,
              form: this,
            }),
          recordUtils.setValue(fieldProps.mapValue(nextValue)),
          recordUtils.resetValidityState,
        ),
      fieldsPatch,
      fields,
    )

    const nextFields = await evolveP(transformers, fields)
    this.setState({ fields: nextFields })
  }

  /**
   * Updates the fields with the given next state of a field.
   * @param {Object} nextFieldState
   * @returns {Promise<Fields>} Updated fields
   */
  updateFieldsWith = (nextFieldState) => {
    const { fields: prevFields } = this.state
    const prevFieldState = R.path(nextFieldState.fieldPath, prevFields)
    const nextFields = recordUtils.updateCollectionWith(
      nextFieldState,
      prevFields,
    )

    return new Promise((resolve, reject) => {
      try {
        this.setState({ fields: nextFields }, () => {
          const { fields: updatedFields } = this.state

          /**
           * Emit fields update event to notify the dedicated handler
           * that introduces possible side-effects based on fields update.
           * For example, a field's "onChange" callback.
           */
          this.eventEmitter.emit('fieldsDidUpdate', {
            prevFieldState,
            nextFieldState,
            prevFields,
            nextFields: updatedFields,
          })

          resolve(updatedFields)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * A subscription handler method that is invoked whenever fields have updated.
   * Designed to introduce any side-effects based on fields update (i.e. onChange).
   * Note that each fields update has a reason (fieldState), therefore it's
   * possible to diff required props and dispatch respective side-effects.
   */
  fieldsDidUpdate = ({ prevFieldState, nextFieldState, nextFields }) => {
    const prevValue = recordUtils.getValue(prevFieldState)
    const nextValue = recordUtils.getValue(nextFieldState)

    if (!R.equals(prevValue, nextValue)) {
      const { fieldPath, onChange } = nextFieldState
      dispatch(onChange, {
        prevValue,
        nextValue,
        fieldProps: R.path(fieldPath, nextFields),
        fields: nextFields,
        form: this,
      })
    }
  }

  /**
   * Deletes the list of fields from the state.
   * @param {FieldState[]} fieldsList
   */
  unregisterFields = (fieldsList) => {
    const stitchedFields = fieldUtils.stitchFields(fieldsList)
    const nextFields = R.compose(
      fieldUtils.stitchFields,
      R.reject((fieldState) => R.path(fieldState.fieldPath, stitchedFields)),
      fieldUtils.flattenFields,
    )(this.state.fields)

    this.setState({ fields: nextFields })
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
      prevValue,
      nextValue,
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

    const nextFieldProps = await handlers.handleFieldChange(
      args,
      fields,
      this,
      {
        onUpdateValue: this.updateFieldsWith,
      },
    )

    /**
     * Change handler for controlled fields does not return the next field props
     * record, therefore, need to explicitly ensure the payload was returned.
     */
    if (nextFieldProps) {
      await this.updateFieldsWith(nextFieldProps)
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
    const { nextFieldProps } = await handlers.handleFieldBlur(
      args,
      fields,
      this,
    )

    this.updateFieldsWith(nextFieldProps)
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
   * When an optional predicate function is supplied, validates only the fields that
   * match the given predicate.
   * @param {Function} predicate
   * @returns {boolean}
   */
  validate = async (predicate = R.T) => {
    const { fields } = this.state
    const { onInvalid } = this.props

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

    if (!isFormValid && onInvalid) {
      const { fields: nextFields } = this.state

      /* Get a map of invalid fields */
      const invalidFields = R.filter(
        R.propEq('expected', false),
        validatedFields,
      )

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
   * Clears the fields.
   * Clears the fields matching the given predicate.
   * @param {Function} predicate
   */
  clear = (predicate = Boolean) => {
    const nextFields = R.compose(
      fieldUtils.stitchFields,
      R.map(R.when(predicate, recordUtils.reset(R.always('')))),
      fieldUtils.flattenFields,
    )(this.state.fields)

    this.setState({ fields: nextFields }, () => {
      dispatch(
        this.props.onClear,
        {
          fields: nextFields,
          form: this,
        },
        this.context,
      )
    })
  }

  /**
   * Resets all the fields to their initial state.
   * @param {Function} predicate
   */
  reset = (predicate = Boolean) => {
    const nextFields = R.compose(
      fieldUtils.stitchFields,
      R.map(R.when(predicate, recordUtils.reset(R.prop('initialValue')))),
      fieldUtils.flattenFields,
    )(this.state.fields)

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
   * Sets the objects mapping field paths to error messages,
   * and applies the given messages to the form's fields.
   * @param {Object} fieldsDelta
   */
  setErrors = (fieldsDelta) => {
    const { fields } = this.state

    /**
     * Get transformers for fields in the following format:
     * [fieldPath]: fieldTransformer(fieldProps)
     */
    const transformers = deriveDeepWith(
      (_, errors) =>
        R.compose(
          recordUtils.setErrors(errors),
          recordUtils.updateValidityState(true),
          recordUtils.setTouched(!!errors),
          R.assoc('expected', !errors),
          R.assoc('validated', true),
        ),
      fieldsDelta,
      fields,
    )

    /**
     * Apply transformers object to the current fields.
     * Fields not included in transformers are returned as-is.
     */
    const nextFields = R.evolve(transformers, fields)

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
    const { innerRef, children, id, className, style } = this.props

    return (
      <form
        ref={(ref) => bindInnerRef.call(this, ref, innerRef)}
        id={id}
        className={className}
        style={style}
        onSubmit={this.submit}
        noValidate
      >
        {children}
      </form>
    )
  }
}
