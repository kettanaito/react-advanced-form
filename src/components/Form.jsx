import invariant from 'invariant';
import React from 'react';
import PropTypes from 'prop-types';
import { EventEmitter } from 'events';
import { fromJS, Record, List, Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/bufferTime';
import 'rxjs/add/observable/fromEvent';

/* Internal modules */
import { defaultDebounceTime, TValidationRules, TValidationMessages } from './FormProvider';
import {
  CustomPropTypes,
  isset,
  camelize,
  dispatch,
  flattenDeep,
  recordUtils,
  fieldUtils,
  formUtils,
  rxUtils
} from '../utils';
import validateFunc from '../utils/validation';

/**
 * Shorthand: Binds the component's reference to the function's context and calls an optional callback
 * function to access that reference.
 * @param {HTMLElement} element
 * @param {Function} callback
 */
function getInnerRef(element, callback) {
  this.innerRef = element;
  if (callback) callback(element);
}

function filterFields(entry) {
  return entry.has('fieldPath');
}

export default class Form extends React.Component {
  static propTypes = {
    /* General */
    innerRef: PropTypes.func, // reference to the <form> element
    action: PropTypes.func.isRequired, // form submit action

    /* Validation */
    rules: TValidationRules,
    messages: TValidationMessages,

    /* Events */
    onFirstChange: PropTypes.func,
    onReset: PropTypes.func,
    onInvalid: PropTypes.func,
    onSubmitStart: PropTypes.func, // form should submit, submit started
    onSubmitted: PropTypes.func, // form submit went successfully
    onSubmitFailed: PropTypes.func, // form submit failed
    onSubmitEnd: PropTypes.func // form has finished submit (regardless of the result)
  }

  static defaultProps = {
    action: () => new Promise(resolve => resolve())
  }

  state = {
    fields: Map(),
    rxRules: Map(),
    dirty: false
  }

  /* Context which is accepted by Form */
  static contextTypes = {
    rules: CustomPropTypes.Map,
    messages: CustomPropTypes.Map,
    debounceTime: PropTypes.number,
    withImmutable: PropTypes.bool
  }

  /* Context which Form passes to Fields */
  static childContextTypes = {
    fields: CustomPropTypes.Map.isRequired,
    form: PropTypes.object.isRequired
  }

  getChildContext() {
    return {
      fields: this.state.fields,
      form: this
    };
  }

  constructor(props, context) {
    super(props, context);
    const { rules: explicitRules, messages: explicitMessages } = props;
    const { debounceTime, rules, messages } = context;

    /* Provide a fallback value for validation debounce duration */
    this.debounceTime = isset(debounceTime) ? debounceTime : defaultDebounceTime;

    /* Define validation rules */
    this.formRules = formUtils.mergeRules(explicitRules, rules);

    /**
     * Define validation messages once, since those should be converted to immutable, which is
     * an expensive procedure. Moreover, messages are unlikely to change during the component's
     * lifecycle. It should be safe to store them.
     * Note: Messages passed from FormProvider (context messages) are already immutable.
     */
    this.messages = explicitMessages ? fromJS(explicitMessages) : messages;

    /* Create a private event emitter to communicate between form and its fields */
    const eventEmitter = new EventEmitter();
    this.eventEmitter = eventEmitter;

    /* Field lifecycle observerables */
    Observable.fromEvent(eventEmitter, 'fieldRegister')
      .bufferTime(100)
      .subscribe(pendingFields => pendingFields.forEach(this.registerField));
    Observable.fromEvent(eventEmitter, 'fieldFocus').subscribe(this.handleFieldFocus);
    Observable.fromEvent(eventEmitter, 'fieldChange').subscribe(this.handleFieldChange);
    Observable.fromEvent(eventEmitter, 'fieldBlur').subscribe(this.handleFieldBlur);
    Observable.fromEvent(eventEmitter, 'fieldUnregister').subscribe(this.unregisterField);
    Observable.fromEvent(eventEmitter, 'validateField').subscribe(this.validateField);
  }

  /**
   * Maps the field to the state/context.
   * Passing fields in context gives a benefit of removing an explicit traversing of children
   * tree, deconstructing and constructing each appropriate child with the attached handler props.
   * @param {Record} fieldProps
   */
  registerField = ({ fieldProps: initialFieldProps, fieldOptions }) => {
    const { fields } = this.state;
    const { fieldPath } = initialFieldProps;
    const isAlreadyExist = fields.hasIn(fieldPath);

    console.groupCollapsed(`${fieldPath.join('.')} @ registerField`);
    console.log('field options received:', fieldOptions);
    console.log('received field record:', initialFieldProps.toJS());
    console.log('field already exists:', isAlreadyExist);

    /* Warn on field duplicates */
    invariant(!(isAlreadyExist && !fieldOptions.allowMultiple), 'Cannot register field `%s`, the field with ' +
      'the provided name is already registered. Make sure the fields on the same level of `Form` ' +
      'or `Field.Group` have unique names.', fieldPath);

    console.log('calling "beforeRegister" hook to alter field record...');
    console.log('"beforeRegister" method:', fieldOptions.beforeRegister);

    /* Perform custom field props transformations upon registration */
    const fieldProps = fieldOptions.beforeRegister({
      fieldProps: initialFieldProps,
      fields
    });

    console.log('"beforeRegister" hook called successfully!');
    console.log('fieldProps after "beforeRegister":', fieldProps && fieldProps.toJS());

    if (!fieldProps) {
      console.log('no field props, return');
      console.groupEnd();
      return;
    }

    const nextFields = fields.setIn(fieldPath, fieldProps);
    const { eventEmitter } = this;

    console.log('next fields:', nextFields && nextFields.toJS());

    /**
     * Synchronize the field record with the field props.
     * Create a props change observer to keep field's record in sync with the props changes
     * of the respective field component. Only the changes in the props relative to the record
     * should be observed and synchronized.
     */
    rxUtils.createPropsObserver({
      fieldPath,
      props: ['type'],
      eventEmitter
    }).subscribe(({ changedProps }) => {
      //
      // TODO
      // RxProps is not aligned with the changes.
      //
      this.updateField({
        fieldPath,
        update: fieldProps => Object.keys(changedProps).reduce((acc, propName) => {
          return acc.set(propName, changedProps[propName]);
        }, fieldProps)
      });
    });

    console.log('props observers created!');

    /**
     * Analyze the rules relevant to the registered field and create reactive subscriptions to
     * resolve them once their dependencies update. Returns the Map of the recorded formatted rules.
     * That Map is later used during the sync validation as the rules source.
     */
    const nextRxRules = rxUtils.createRulesSubscriptions({
      fieldProps,
      fields,
      form: this
    });

    console.log('next rx rules composed!');
    console.groupEnd();

    this.setState({ fields: nextFields, rxRules: nextRxRules }, () => {
      /* Emit the field registered event */
      const fieldRegisteredEvent = camelize(...fieldPath, 'registered');
      eventEmitter.emit(fieldRegisteredEvent, fieldProps);

      if (fieldOptions.shouldValidateOnMount) {
        console.warn('should validate on mount!');

        this.validateField({
          fieldProps,

          /**
           * Enforce the validation function to use the "fieldProps" provided directly.
           * By default, it will try to grab the field record from the state, which is
           * missing at this point of execution.
           */
          forceProps: true
        });
      }

      /* Create subscriptions for reactive props */
      rxUtils.createSubscriptions({
        fieldProps,
        fields: nextFields,
        form: this
      });
    });
  }

  /**
   * Determines if the provided field has its record within the state.
   * @param {Record} fieldProps
   * @return {boolean}
   */
  hasField = (fieldProps) => {
    return this.state.fields.hasIn(fieldProps.fieldPath);
  }

  /**
   * Updates the provided field using a pure "update" function.
   * Fields can be updated by their field paths, or by providing their field props explicitly.
   * The latter is useful for scenarios when the field props values are different than those
   * stored in form's state at the moment of dispatching field update (i.e. field validation).
   * @param {string[]} fieldPath
   * @param {Record} fieldProps
   * @param {Function} update
   * @returns {Promise}
   */
  updateField = ({ fieldPath: explicitFieldPath, fieldProps: explicitFieldProps, update }) => {
    invariant(update, 'Field update failed: expected an `update` function, but got: %s', update);
    invariant(explicitFieldPath || explicitFieldProps, 'Field update failed: expected `fieldPath` or `fieldProps` ' +
      'provided, but got: %s.', explicitFieldPath || explicitFieldProps);

    const { fields } = this.state;
    const fieldPath = explicitFieldProps ? explicitFieldProps.fieldPath : explicitFieldPath;
    const fieldProps = explicitFieldProps || fields.getIn(fieldPath);
    const nextFieldProps = update(fieldProps);
    const nextFields = fields.setIn(fieldPath, nextFieldProps);

    console.groupCollapsed(`${fieldPath.join('.')} @ updateField`);
    console.log('fieldProps:', Object.assign({}, fieldProps.toJS()));
    console.log('fields before update:', Object.assign({}, fields.toJS()));
    console.log('next fieldProps:', Object.assign({}, nextFieldProps.toJS()));
    console.log('next value:', nextFieldProps.get(nextFieldProps.get('valuePropName')));
    console.log('nextFields:', Object.assign({}, nextFields.toJS()));
    console.groupEnd();

    return new Promise((resolve, reject) => {
      try {
        this.setState({ fields: nextFields }, () => {
          resolve({ nextFieldProps, nextFields });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Updates the fields with the given instance of the field and returns
   * the updated state of the fields.
   * @param {Record} fieldRecord
   * @returns {Promise}
   */
  updateFieldsWith = (fieldRecord) => {
    const nextFields = recordUtils.updateCollectionWith(fieldRecord, this.state.fields);

    console.groupCollapsed('updateFieldsWith', fieldRecord.fieldPath.join('.'));
    console.log('fieldRecord:', fieldRecord.toJS());
    console.log('nextFields:', nextFields.toJS());
    console.groupEnd(' ');

    return new Promise((resolve, reject) => {
      try {
        this.setState({ fields: nextFields }, resolve.bind(this, nextFields));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Deletes the field record from the state.
   * @param {Record} fieldRecord
   */
  unregisterField = (fieldRecord) => {
    this.setState(prevState => ({
      fields: prevState.fields.deleteIn(fieldRecord.fieldPath)
    }));
  }

  /**
   * Handles the first field change of the form.
   * @param {Event} event
   * @param {any} nextValue
   * @param {any} prevValue
   * @param {Record} fieldProps
   */
  handleFirstChange = ({ event, prevValue, nextValue, fieldProps }) => {
    const { onFirstChange } = this.props;
    if (!onFirstChange) {
      return;
    }

    dispatch(onFirstChange, {
      event,
      nextValue,
      prevValue,
      fieldProps,
      fields: this.state.fields,
      form: this
    }, this.context);

    this.setState({ dirty: true });
  }

  /**
   * Handles field focus.
   * @param {Event} event
   * @param {Record} fieldProps
   */
  handleFieldFocus = async ({ event, fieldProps }) => {
    /* Bypass events called from an unregistered Field */
    if (!this.hasField(fieldProps)) {
      return;
    }

    console.groupCollapsed(`${fieldProps.fieldPath.join('.')} @ handleFieldFocus`);
    console.log('fieldProps', Object.assign({}, fieldProps.toJS()));
    console.groupEnd();

    const nextFieldProps = recordUtils.setFocus(fieldProps);
    const nextFields = await this.updateFieldsWith(nextFieldProps);

    /* Call custom onFocus handler */
    const customFocusHandler = fieldProps.get('onFocus');
    if (!customFocusHandler) {
      return;
    }

    dispatch(customFocusHandler, {
      event,
      fieldProps: nextFieldProps,
      fields: nextFields,
      form: this
    }, this.context);
  }

  /**
   * Handles field change.
   * @param {Event} event
   * @param {Record} fieldProps
   * @param {mixed} prevValue
   * @param {mixed} nextValue
   */
  handleFieldChange = async ({ event, prevValue, nextValue, fieldProps }) => {
    /* Bypass events called from an unregistered Field */
    if (!this.hasField(fieldProps)) {
      return;
    }

    console.groupCollapsed(`${fieldProps.fieldPath.join('.')} @ handleFieldChange`);
    console.log('fieldProps', Object.assign({}, fieldProps.toJS()));
    console.log('nextValue', nextValue);
    console.groupEnd();

    /**
     * Handle "onChange" events dispatched by the controlled field.
     * Controlled field must execute its custom "CustomField.props.onChange" handler since that
     * is the updater for the source (i.e. state) controlling its value. Internal RAF change handling
     * must be omitted in that scenario, as it will be bubbled to eventually via
     * "createField.Field.componentReceiveProps()", when comparing previous and next values of
     * controlled fields.
     */
    const isForcedUpdate = event && !((event.nativeEvent || event).isForcedUpdate);
    const isControlled = fieldProps.get('controlled');
    const customChangeHandler = fieldProps.get('onChange');

    if (isForcedUpdate && isControlled) {
      invariant(customChangeHandler, 'Cannot update the controlled field `%s`. Expected custom `onChange` handler, ' +
        'but got: %s.', fieldProps.get('name'), customChangeHandler);

      return dispatch(customChangeHandler, {
        event,
        nextValue,
        prevValue,
        fieldProps,
        fields: this.state.fields,
        form: this
      }, this.context);
    }

    /* Reset the validation state and update the field's value prop */
    const updatedFieldProps = recordUtils.setValue(
      recordUtils.resetValidationState(fieldProps),
      nextValue
    );

    /* Update fields to reflect the updated field value */
    await this.updateFieldsWith(updatedFieldProps);

    /**
     * Cancel any pending async validation.
     * Once the field's value has changed, the previously dispatched async validation
     * is no longer relevant, since it validates the previous value.
     */
    //
    // TODO
    // A reference to the pending async validation (request) is not yet set in the validateAsync.
    //
    const pendingAsyncValidation = updatedFieldProps.get('pendingAsyncValidation');
    if (pendingAsyncValidation) {
      pendingAsyncValidation.get('cancel')();
    }

    /**
     * Determine whether to debounce the validation.
     * For example, for immediate clearing of field value the validation must be
     * performed immediately, while for typing the value it must be debounced.
     */
    const shouldDebounce = !!prevValue && !!nextValue;
    const appropriateValidation = shouldDebounce ? fieldProps.debounceValidate : this.validateField;

    //
    // Should this be encapsulated into Form.validateField, or be an independent function?
    //
    const validatedFieldProps = await appropriateValidation({
      types: types => [types.sync],
      fieldProps: updatedFieldProps,

      //
      // NOTE
      // When passed explicitly here, the state of the fields may be outdated for some reason.
      // I think it has to do with the debounce nature of this function call.
      // Internally, "validateField" referenced to the very same fields, but at that moment
      // their entries are up-to-date.
      //
      // fields: this.state.fields,
      form: this
    });

    console.warn({ validatedFieldProps })

    /**
     * Perform appropriate field validation on value change.
     * When field has a value set, perform debounced sync validation. For the cases
     * when the user clears the field instantly, perform instant sync validation.
     *
     * The presence of "value" alone is not enough to determine the necessity for debounced
     * validation. For instance, it is only when the previous and next value exist we can
     * assume that the user is typing in the field. Change from "undefined" to some value
     * most likely means the value update of the controlled field, which must be validated
     * instantly.
     */
    // const shouldDebounce = !!prevValue && !!nextValue;
    // const appropriateValidation = shouldDebounce ? fieldProps.get('debounceValidate') : this.validateField;

    //
    // TODO NEEDS TO BE HANDLED FUNCTIONALLY
    // const { nextFields, nextFieldProps: validatedFieldProps } = await appropriateValidation({
    //   type: SyncValidationType,
    //   fieldProps: updatedFieldProps,
    //   forceProps: !shouldDebounce
    // });

    /**
     * Call custom "onChange" handler for uncontrolled fields only.
     * "onChange" callback method acts as an updated function for controlled fields, and as a callback
     * function for uncontrolled fields. The value update of uncontrolled fields is handled by the Form.
     * Controlled fields dispatch "onChange" handler at the beginning of this method.
     * There is no need to dispatch the handler method once more.
     */
    if (!isControlled && customChangeHandler) {
      dispatch(customChangeHandler, {
        event,
        nextValue,
        prevValue,
        fieldProps: validatedFieldProps,
        fields: this.state.fields,
        form: this
      }, this.context);
    }

    /* Mark form as dirty if it's not already */
    if (!this.state.dirty) {
      this.handleFirstChange({ event, prevValue, nextValue, fieldProps });
    }
  }

  /**
   * Handles field blur.
   * @param {Event} event
   * @param {Record} fieldProps
   */
  handleFieldBlur = async ({ event, fieldProps }) => {
    /* Bypass events called from an unregistered Field */
    if (!this.hasField(fieldProps)) {
      return;
    }

    console.warn('Handle field blur');

    let nextFieldProps = fieldProps;
    let nextFields = this.state.fields;

    /**
     * Determine whether the validation is needed.
     * Also, determine a type of the validation. In case the field has been validated sync
     * and is valid sync, it's ready to be validated async (if any async validation is present).
     * However, if the field hasn't been validated sync yet (hasn't been touched), first require
     * sync validation. When the latter fails, user will be prompted to change the value of the
     * field. Changing the value resets the "async" validation state as well. Hence, when the
     * user will pass sync validation, upon blurring out the field, the validation type will
     * be "async".
     */
    //
    //
    // TODO Review if this is really needed. Why not just "ValidationType.shouldValidate()"?
    // Or even better - get rid of classes and determine validation necessity via a pure function?
    //
    //
    // const shouldValidate = !validatedSync || (validSync && !validatedAsync && asyncRule);

    console.groupCollapsed(`${fieldProps.fieldPath.join('.')} @ handleFieldBlur`);
    console.log('fieldProps', Object.assign({}, fieldProps.toJS()));
    // console.log('should validate', shouldValidate);
    console.groupEnd();

    // if (shouldValidate) {
    /* Indicate that the validation is running */
    const validatingField = recordUtils.beginValidation(fieldProps);

    /* Validate the field */
    const validatedField = await this.validateField({
      fieldProps: validatingField,
      shouldUpdateFields: false
    });

    /* Reflect the end of the validation */
    nextFieldProps = recordUtils.endValidation(validatedField);
    nextFields = await this.updateFieldsWith(nextFieldProps);
    // }

    /* Call custom onBlur handler */
    const customBlurHandler = nextFieldProps.get('onBlur');
    if (!customBlurHandler) {
      return;
    }

    dispatch(customBlurHandler, {
      event,
      fieldProps: nextFieldProps,
      fields: nextFields,
      form: this
    }, this.context);
  }

  /**
   * Validates the provided field.
   * @param {Record} fieldProps
   * @param {ValidationType} type
   * @param {boolean?} forceProps Use the field props from the arguments instead of form's state.
   * @param {Map?} fields Explicit fields state to prevent validation concurrency.
   * @param {boolean?} force Force validation. Bypass "shouldValidate" logic.
   */
  validateField = async (args) => {
    const {
      types,
      fieldProps: explicitFieldProps,
      fields: explicitFields,
      forceProps = false,
      // force = false, // TODO Possibly deprecated?
      shouldUpdateFields = true
    } = args;

    //
    // TODO Shouldn't this be "this.rxRules"???
    //
    // const { formRules } = this;
    const fields = explicitFields || this.state.fields;

    let fieldProps = forceProps ? explicitFieldProps : fields.getIn(explicitFieldProps.fieldPath);
    fieldProps = fieldProps || explicitFieldProps;

    /* Determine the necessity of the validation */
    // const shouldValidate = force || getValidationNecessity(
    //   types,
    //   fieldProps,
    //   formRules
    // );

    console.groupCollapsed(`XXX ${fieldProps.fieldPath.join('.')} @ validateField`);
    console.warn('stack trace');
    console.log('validation types', types);
    console.log('value', fieldProps.get(fieldProps.get('valuePropName')));
    console.log('fieldProps', fieldProps.toJS());
    console.log('explicit fields:', explicitFields && explicitFields.toJS());
    console.log('force props?', forceProps);
    console.groupEnd();

    /* Bypass the validation when none is needed */
    // if (!shouldValidate) {
    //   return fieldProps;
    // }

    /* Perform the validation */

    //
    // TODO Which arguments does it expect?
    // It seems like there can be different validators sequence depending on the validation type.
    //
    const validationResult = await validateFunc({
      types,
      fieldProps,
      fields: this.state.fields,
      form: this
    });

    console.log(`validationResult for "${fieldProps.name}":`, validationResult);

    if (!validationResult) {
      return fieldProps;
    }

    const { expected } = validationResult;

    console.warn('field validated, expected: %s. reflecting validation state...', expected)

    /* Reflect the validation result on the field record */
    let nextFieldProps = recordUtils.reflectValidation({
      types,
      fieldProps,
      validationResult
    });

    /* Set error messages to the field */
    const { messages } = this;
    const hasFormMessages = messages && messages.size > 0;

    if (hasFormMessages && !expected) {
      const errorMessages = fieldUtils.getErrorMessages({
        validationResult,
        messages,
        fieldProps,
        fields,
        form: this
      });

      nextFieldProps = recordUtils.setErrors(nextFieldProps, errorMessages);
    }

    console.log('validation is done, props:', nextFieldProps.toJS());

    /* Update the field in the state to reflect the changes */
    if (shouldUpdateFields) {
      await this.updateFieldsWith(nextFieldProps);
    }

    return nextFieldProps;
  }

  /**
   * Performs the validation of each field in parallel, awaiting for all the pending
   * validations to be completed.
   * @param {Function} predicate (Optional) Predicate function to filter the fields.
   */
  validate = async (predicate = filterFields) => {
    const { fields } = this.state;
    const flattenedFields = flattenDeep(fields, predicate, true);

    /* Validate only the fields matching the optional selection */
    const validationSequence = flattenedFields.reduce((validations, fieldProps) => {
      return validations.concat(this.validateField({ fieldProps }));
    }, []);

    /* Await for all validation promises to resolve before returning */
    const validatedFields = await Promise.all(validationSequence);

    const isFormValid = !validatedFields.some((nextFieldProps) => {
      return !nextFieldProps.get('expected');
    });

    const { onInvalid } = this.props;

    if (!isFormValid && onInvalid) {
      const { fields: nextFields } = this.state;

      /* Reduce the invalid fields to the ordered Array */
      const invalidFields = List(nextFields.filterNot(fieldProps => fieldProps.get('expected')));

      /* Call custom callback */
      dispatch(onInvalid, {
        fields: nextFields,
        invalidFields,
        form: this
      }, this.context);
    }

    return isFormValid;
  }

  /**
   * Resets all the fields to their initial state upon mounting.
   */
  reset = () => {
    //
    // TODO .clear() which is done by reseting the field record RESETS NAME,TYPE, etc.
    //
    const nextFields = this.state.fields.map(fieldProps => recordUtils.reset(fieldProps));

    // console.groupCollapsed('reset @ Form');
    // console.log('prev fields:', this.state.fields.toJS());
    // console.log('next fields:', nextFields && nextFields.toJS());
    // console.groupEnd();

    this.setState({ fields: nextFields }, () => {
      /* Validate only non-empty fields, since empty required fields should not be unexpected after reset */
      this.validate(entry => Record.isRecord(entry) && (entry.value !== ''));

      /* Call custom callback methods to be able to reset controlled fields */
      const { onReset } = this.props;
      if (!onReset) {
        return;
      }

      dispatch(onReset, {
        fields: nextFields,
        form: this
      }, this.context);
    });
  }

  /**
   * Serializes the fields' values into a plain Object.
   * @returns {Map|Object}
   */
  serialize = () => {
    const serialized = fieldUtils.serializeFields(this.state.fields);
    return this.context.withImmutable ? serialized : serialized.toJS();
  }

  /**
   * Submits the form.
   * @param {Event} event
   */
  submit = async (event) => {
    if (event) event.preventDefault();

    /* Throw on submit attempt without the "action" prop */
    const { action } = this.props;

    invariant(action, 'Cannot submit the form without `action` prop specified explicitly. Expected a function ' +
      'which returns Promise, but received: %s.', action);

    /* Ensure form has no unexpected fields and, therefore, should be submitted */
    const shouldSubmit = await this.validate();
    if (!shouldSubmit) return;

    const { fields } = this.state;
    const { onSubmitStart, onSubmitted, onSubmitFailed, onSubmitEnd } = this.props;

    /* Serialize the fields */
    const serialized = this.serialize();

    /* Compose a single Object of arguments passed to each custom handler */
    const callbackArgs = {
      serialized,
      fields,
      form: this
    };

    /**
     * Event: Submit has started.
     * The submit is consideres started immediately when the submit button is pressed.
     * This is a good place to have a UI logic dependant on the form submit (i.e. loaders).
     */
    if (onSubmitStart) dispatch(onSubmitStart, callbackArgs, this.context);

    const dispatchedAction = dispatch(action, callbackArgs, this.context);

    invariant(dispatchedAction && (typeof dispatchedAction.then === 'function'), 'Cannot submit the form. ' +
      'Expected `action` prop of the Form to return an instance of Promise, but got: %s. Make sure you return a ' +
      'Promise from your action handler.', dispatchedAction);

    return dispatchedAction.then((res) => {
      if (onSubmitted) dispatch(onSubmitted, { ...callbackArgs, res }, this.context);
      return res;
    }).catch((res) => {
      if (onSubmitFailed) dispatch(onSubmitFailed, { ...callbackArgs, res }, this.context);
      return res;
    }).then((res) => {
      if (onSubmitEnd) dispatch(onSubmitEnd, { ...callbackArgs, res }, this.context);
    });
  }

  render() {
    const { innerRef, id, className, children } = this.props;

    return (
      <form
        ref={ ref => getInnerRef.call(this, ref, innerRef) }
        { ...{ id } }
        { ...{ className } }
        onSubmit={ this.submit }
        noValidate>
        { children }
      </form>
    );
  }
}
