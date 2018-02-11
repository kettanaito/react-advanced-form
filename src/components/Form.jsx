import React from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import { fromJS, Iterable, List, Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/mapTo';
// import 'rxjs/add/operator/reduce';
// import 'rxjs/add/operator/takeUntil';
// import 'rxjs/add/operator/throttle';
// import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';

/* Internal modules */
import { TValidationRules, TValidationMessages } from './FormProvider';
import { BothValidationType, SyncValidationType } from '../classes/ValidationType';
import { isset, debounce, dispatch, getFormRules, fieldUtils, IterableInstance } from '../utils';

/**
 * Shorthand: Binds the component's reference to the function's context and calls an optional callback
 * function to access that reference.
 * @param {HTMLElement} ref
 * @param {Function} callback
 */
function getInnerRef(element, callback) {
  this.innerRef = element;
  if (callback) callback(element);
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
    dynamicFields: Map(),
    subscriptions: Map(),
    dirty: false
  }

  /* Context which is accepted by Form */
  static contextTypes = {
    rules: IterableInstance,
    messages: IterableInstance,
    withImmutable: PropTypes.bool,
    debounceTime: PropTypes.number.isRequired
  }

  /* Context which Form passes to Fields */
  static childContextTypes = {
    fields: IterableInstance,
    subscriptions: IterableInstance,
    registerField: PropTypes.func.isRequired,
    updateField: PropTypes.func.isRequired,
    unregisterField: PropTypes.func.isRequired,
    handleFieldFocus: PropTypes.func.isRequired,
    handleFieldBlur: PropTypes.func.isRequired,
    handleFieldChange: PropTypes.func.isRequired
  }

  getChildContext() {
    return {
      fields: this.state.fields,
      subscriptions: this.state.subscriptions,
      registerField: this.registerField,
      updateField: this.updateField,
      unregisterField: this.unregisterField,
      handleFieldFocus: this.handleFieldFocus,
      handleFieldBlur: this.handleFieldBlur,
      handleFieldChange: this.handleFieldChange
    };
  }

  constructor(props, context) {
    super(props, context);

    /* Define validation rules */
    this.formRules = getFormRules(this.props.rules, this.context.rules);

    /**
     * Define validation messages once, since those should be converted to immutable, which is
     * an expensive procedure. Moreover, messages are unlikely to change during the component's
     * lifecycle. It should be safe to store them.
     * Note: Messages passed from FormProvider (context messages) are already immutable.
     */
    const { messages } = this.props;
    this.messages = messages ? fromJS(messages) : this.context.messages;
  }

  /**
   * Maps the field to the state/context.
   * Passing fields in context gives a benefit of removing an explicit traversing of children
   * tree, deconstructing and constructing each appropriate child with the attached handler props.
   * @param {Map} fieldProps
   */
  registerField = (fieldProps) => {
    const { fields, subscriptions } = this.state;
    const fieldPath = fieldProps.get('fieldPath');
    const isAlreadyExist = fields.hasIn([fieldPath]);
    const isRadioButton = (fieldProps.get('type') === 'radio');

    console.groupCollapsed(fieldPath, '@ registerField');
    console.log('fieldProps', fieldProps.toJS());
    console.log('already exists:', isAlreadyExist);
    console.groupEnd();

    /* Warn upon duplicate registrations */
    if (isAlreadyExist && !isRadioButton) {
      return console.warn('Cannot register field `%s`, the field with the provided name is already registered. '
      + 'Make sure the fields on the same level of `Form` or `Field.Group` have unique names.', fieldPath);
    }

    /* Get the value-like property of the field */
    const valuePropName = fieldProps.get('valuePropName');
    const fieldValue = fieldProps.get(valuePropName);

    if (isRadioButton && isAlreadyExist) {
      /**
       * When the Radio field with the same name is already registered, check if it had
       * some value in the record. Radio fields with "checked" prop are propagating their value
       * to the field's record. Other Radio fields are registered, but their value is ignored.
       */
      const existingValue = fields.getIn([fieldPath, valuePropName]);
      if (existingValue) return;

      if (fieldValue) {
        fieldProps = fieldProps.set(valuePropName, fieldValue);
      }
    }

    /* Validate the field when it has initial value */
    const shouldValidate = isset(fieldValue) && (fieldValue !== '');
    if (shouldValidate) {
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

    /**
     * Each field should have its own debounced validation function to prevent debounce overlap
     * of the simultaneously validating fields. If bind on a form level, sibling validations will
     * override each other, and only the last validation will be executed.
     */
    fieldProps = fieldProps.set('debounceValidate', debounce(this.validateField, this.context.debounceTime));

    const nextFields = fields.mergeIn([fieldPath], fieldProps);

    /**
     * Reactive props.
     * Should update the subscriptions map in case the newly registered field is subscribed to any props.
     */
    let nextSubscriptions = subscriptions;

    if (fieldProps.has('reactiveProps')) {
      nextSubscriptions = fieldProps.get('reactiveProps').reduce((subscriptions, rxPropValue, rxPropName) => {
        /**
         * Execute the reactive prop value.
         * The resolver function must return an interface of `field.subscribe()` method. This way the target field
         * becomes exposed to the context of current iteration, as well as the subscribed props and the actual value
         * resolver, which is defined inside `field.subscribe(props: string[], resolver: Function)`.
         */
        const { props: subscribedProps, fieldPath: subscribedFieldPath, resolver } = rxPropValue({
          fieldProps,
          fields: nextFields.toJS(),
          form: this
        });

        const subscribedFieldProps = nextFields.getIn([subscribedFieldPath]);

        subscribedProps.forEach((subscribedPropName) => {
          console.log('subscribed to:', subscribedFieldProps && subscribedFieldProps.toJS());
          console.log('should subscribe to', subscribedPropName, 'of the field:', subscribedFieldPath);

          const eventEmitter = subscribedFieldProps.get('eventEmitter');
          const propChangeEvent = subscriptionUtils.composeEventName({
            fieldProps: subscribedFieldProps,
            propName: subscribedPropName
          });

          /**
           * Create an observer which would liten to the dispatched prop change events, debounce them
           * and update the subscribed field upon prop change.
           */
          const eventObserver = Observable.fromEvent(eventEmitter, propChangeEvent).debounceTime(250);

          /**
           * Subscribe to the props change event.
           * Listen to the change event emitted upon the change of the subscribed props and update the
           * subscribed field based on the next values of those props.
           */
          eventObserver.subscribe((subscribedProps) => {
            const nextPropValue = resolver(subscribedProps);
            console.warn(`next value of "${rxPropName}":`, nextPropValue);

            this.updateField({
              fieldPath,
              propsPatch: {
                [rxPropName]: nextPropValue
              }
            });
          });
        });

        const prevSubscribedProps = subscriptions.getIn([subscribedFieldPath]) || List();
        const nextSubscribedProps = prevSubscribedProps.push(subscribedProps);
        return subscriptions.set(subscribedFieldPath, nextSubscribedProps);
      }, Map());
    }

    return this.setState({
      fields: nextFields,
      subscriptions: nextSubscriptions
    });
  }

  /**
   * Determines if the provided field has its record within the state.
   * @param {Map} fieldProps
   * @return {boolean}
   */
  isRegistered = (fieldProps) => {
    return this.state.fields.hasIn([fieldProps.get('fieldPath')]);
  }

  /**
   * Updates the props of the field stored in the state.
   * @param {string} fieldPath The name of the field.
   * @param {Map} fieldProps A directly specified nextProps of the field.
   * @param {object} propsPath A partial Object of the props to merge with the existing field record.
   * @return {Promise<any>}
   */
  updateField = ({ fieldPath, fieldProps: customFieldProps, propsPatch = null }) => {
    const { fields } = this.state;
    const fieldProps = customFieldProps || fields.getIn([fieldPath]);

    /* Certain updates are being provided an iterable instances already, bypass conversion */
    const iterablePropsPatch = Iterable.isIterable(propsPatch) ? propsPatch : fromJS(propsPatch);
    const nextFieldProps = propsPatch ? fieldProps.merge(iterablePropsPatch) : fieldProps;

    /* Update the field's record in the state to produce the next fields */
    const nextFields = fields.mergeIn([fieldProps.get('fieldPath')], nextFieldProps);

    //
    //
    // FIXME Update the fields with dynamic props
    //
    //
    const nextResolvedFields = nextFields.map((fieldProps) => {
      /* Bypass fields without dynamic props */
      if (!fieldProps.has('dynamicProps')) return fieldProps;

      const resolvedProps = fieldProps.get('dynamicProps').map((resolver) => {
        return dispatch(resolver, {
          fieldProps: nextFieldProps,
          fields: nextFields,
          form: this
        }, this.context);
      });

      return fieldProps.merge(resolvedProps);
    });

    console.groupCollapsed(fieldProps.get('fieldPath'), '@ updateField');
    console.log('fieldProps:', Object.assign({}, fieldProps.toJS()));
    console.log('propsPatch:', propsPatch);
    console.log('next fieldProps:', Object.assign({}, nextFieldProps.toJS()));
    console.log('next value:', nextFieldProps.get('value'));
    console.log('nextFields:', Object.assign({}, nextFields.toJS()));
    console.log('nextResolvedFields:', Object.assign({}, nextResolvedFields.toJS()));
    console.groupEnd();

    /* Promisify the state update in order to "await" it */
    return new Promise((resolve, reject) => {
      try {
        this.setState({ fields: nextResolvedFields }, () => resolve({
          nextFieldProps,
          nextFields: nextResolvedFields
        }));
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Removes the field's record from the state.
   * @param {Map} fieldProps
   */
  unregisterField = (fieldProps) => {
    return this.setState(prevState => ({
      fields: prevState.fields.deleteIn([fieldProps.get('fieldPath')])
    }));
  }

  /**
   * Handles the change which marks form as dirty.
   */
  handleFirstChange = ({ event, nextValue, prevValue, fieldProps }) => {
    const { onFirstChange } = this.props;
    if (onFirstChange) onFirstChange({ event, nextValue, prevValue, fieldProps });
    this.setState({ dirty: true });
  }

  /**
   * Handles field focus.
   * @param {Event} event
   * @param {Map} fieldProps
   */
  handleFieldFocus = async ({ event, fieldProps }) => {
    /* Bypass events called from an unregistered Field */
    if (!this.isRegistered(fieldProps)) return;

    console.groupCollapsed(fieldProps.get('fieldPath'), '@ handleFieldFocus');
    console.log('fieldProps', Object.assign({}, fieldProps.toJS()));
    console.groupEnd();

    const { nextFields, nextFieldProps } = await this.updateField({
      fieldPath: fieldProps.get('fieldPath'),
      propsPatch: {
        focused: true
      }
    });

    /* Call custom onFocus handler */
    const onFocusHandler = fieldProps.get('onFocus');
    if (onFocusHandler) {
      dispatch(onFocusHandler, {
        event,
        fieldProps: nextFieldProps,
        fields: nextFields,
        form: this
      }, this.context);
    }
  }

  /**
   * Handles field change.
   * @param {Event} event
   * @param {Map} fieldProps
   * @param {mixed} prevValue
   * @param {mixed} nextValue
   */
  handleFieldChange = async ({ event, fieldProps, prevValue, nextValue }) => {
    /* Bypass events called from an unregistered Field */
    if (!this.isRegistered(fieldProps)) return;

    console.groupCollapsed(fieldProps.get('fieldPath'), '@ handleFieldChange');
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
    const onChangeHandler = fieldProps.get('onChange');

    if (isForcedUpdate && isControlled) {
      invariant(onChangeHandler, 'Cannot update the controlled field `%s`. Expected custom `onChange` handler, ' +
      'but received: %s.', fieldProps.get('name'), onChangeHandler);

      return dispatch(onChangeHandler, {
        event,
        nextValue,
        prevValue,
        fieldProps,
        fields: this.state.fields,
        form: this
      }, this.context);
    }

    const valuePropName = fieldProps.get('valuePropName');

    const { nextFieldProps: updatedFieldProps } = await this.updateField({
      fieldProps,
      propsPatch: {
        [valuePropName]: nextValue,

        /* Reset the validation states as they are irrelevant to the updated value */
        validating: false,
        validSync: false,
        validAsync: false,
        validatedSync: false,
        validatedAsync: false
      }
    });

    /* Cancel any pending async validation due to the field value change */
    if (updatedFieldProps.has('pendingAsyncValidation')) {
      updatedFieldProps.getIn(['pendingAsyncValidation', 'cancel'])();
    }

    /**
     * Perform appropriate field validation on change.
     * When field has a value set, perform debounced sync validation. For the cases
     * when the user clears the field instantly, perform instant sync validation.
     *
     * The presence of "value" alone is not enough to determine the necessity for debounced
     * validation. For instance, it is only when the previous and next value exist we can
     * assume that the user is typing in the field. Change from "undefined" to some value
     * most likely means the value update of the controlled field, which must be validated
     * instantly.
     */
    const shouldDebounce = (!!prevValue && !!nextValue);
    const appropriateValidation = shouldDebounce ? fieldProps.get('debounceValidate') : this.validateField;

    const { nextFields, nextFieldProps: validatedFieldProps } = await appropriateValidation({
      type: SyncValidationType,
      fieldProps: updatedFieldProps,
      forceProps: !shouldDebounce
    });

    /**
     * Call custom "onChange" handler for uncontrolled fields only.
     * "onChange" callback method acts as an updated function for controlled fields, and as a callback
     * function for uncontrolled fields. The value update of uncontrolled fields is handled by the Form.
     * Controlled fields dispatch "onChange" handler at the beginning of this method.
     * There is no need to dispatch the handler method once more.
     */
    if (!isControlled && onChangeHandler) {
      dispatch(onChangeHandler, {
        event,
        nextValue,
        prevValue,
        fieldProps: validatedFieldProps,
        fields: nextFields,
        form: this
      }, this.context);
    }

    /* Mark form as dirty if it's not already */
    if (!this.state.dirty) {
      this.handleFirstChange({ event, nextValue, prevValue, fieldProps });
    }
  }

  /**
   * Handles field blur.
   * @param {Event} event
   * @param {Map} fieldProps
   */
  handleFieldBlur = async ({ event, fieldProps }) => {
    /* Bypass events called from an unregistered Field */
    if (!this.isRegistered(fieldProps)) return;

    const fieldPath = fieldProps.get('fieldPath');
    const asyncRule = fieldProps.get('asyncRule');
    const validSync = fieldProps.get('validSync');
    const validatedSync = fieldProps.get('validatedSync');
    const validatedAsync = fieldProps.get('validatedAsync');

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
    //
    //
    const shouldValidate = !validatedSync || (validSync && !validatedAsync && asyncRule);

    console.groupCollapsed(fieldProps.get('fieldPath'), '@ handleFieldBlur');
    console.log('fieldProps', Object.assign({}, fieldProps.toJS()));
    console.log('should validate', shouldValidate);
    console.groupEnd();

    if (shouldValidate) {
      /* Indicate that the validation is running */
      const { nextFieldProps } = await this.updateField({
        fieldPath,
        propsPatch: {
          errors: null,
          invalid: false,
          validating: true
        }
      });

      /* Validate the field */
      await this.validateField({ fieldProps: nextFieldProps });
    }

    /* Make field enabled, update its props */
    const { nextFields, nextFieldProps } = await this.updateField({
      fieldPath,
      propsPatch: {
        focused: false,
        validating: false
      }
    });

    /* Call custom onBlur handler */
    const onBlur = nextFieldProps.get('onBlur');
    if (onBlur) {
      dispatch(onBlur, {
        event,
        fieldProps: nextFieldProps,
        fields: nextFields,
        form: this
      }, this.context);
    }
  }

  /**
   * Validates the provided field.
   * @param {Map} fieldProps
   * @param {ValidationType} type
   * @param {boolean} forceProps Use direct props explicitly, without trying to grab field record
   * from the state.
   */
  validateField = async ({ type = BothValidationType, fieldProps: customFieldProps, forceProps = false }) => {
    const { formRules } = this;
    const { fields } = this.state;
    const fieldProps = forceProps
      ? customFieldProps
      : fields.getIn([customFieldProps.get('fieldPath')]) || customFieldProps;

    /* Bypass the validation if the provided validation type has been already validated */
    const shouldValidate = type.shouldValidate({
      validationType: type,
      fieldProps,
      formRules
    });

    console.warn('Validating `%s`...', fieldProps.get('fieldPath'));
    console.groupCollapsed(fieldProps.get('fieldPath'), '@ validateField');
    console.log('validation type', type);
    console.log('value', fieldProps.get('value'));
    console.log('fieldProps', Object.assign({}, fieldProps.toJS()));
    console.log('shouldValidate', shouldValidate);
    console.groupEnd();

    /* Bypass validation when none is needed */
    if (!shouldValidate) {
      return {
        nextFieldProps: fieldProps,
        nextFields: fields
      };
    }

    /* Perform the validation */
    const validationResult = await fieldUtils.validate({
      type,
      fieldProps,
      fields,
      form: this,
      formRules
    });

    /* Update the validity state (valid/invalid) of the field */
    let propsPatch = validationResult.get('propsPatch');
    const expected = propsPatch.get('expected');

    /* Determine if there are any messages available to form */
    const { messages } = this;
    const hasMessages = messages && (messages.size > 0);

    /* Get the validation messages based on the validation result */
    if (hasMessages && !expected) {
      const errorMessages = fieldUtils.getErrorMessages({
        validationResult,
        messages,
        fieldProps,
        fields,
        form: this
      });

      if (errorMessages) {
        propsPatch = propsPatch.set('errors', errorMessages);
      }
    }

    /**
     * Get the next validity (valid/invalid) state.
     * Based on the changed fieldProps, the field aquires a new validity state,
     * which means its "valid" and "invalid" props values are updated.
     */
    const nextFieldProps = fieldProps.merge(propsPatch);
    const nextValidityState = fieldUtils.getValidityState(nextFieldProps);

    /* Update the field in the state to reflect the changes */
    return this.updateField({
      fieldProps,
      propsPatch: propsPatch.merge(nextValidityState)
    });
  }

  /**
   * Validates the form.
   * Calls the validation on each field in parallel, awaiting for all calls
   * to be resolved before returning the result.
   */
  validate = async (fieldSelector) => {
    const { fields } = this.state;

    /* Allow to apply field selector to the fields Map */
    const validatingFields = fieldSelector ? fields.filter(fieldSelector) : fields;

    /* Validate only the fields matching the optional selection */
    const validationSequence = validatingFields.reduce((validations, fieldProps) => {
      return validations.concat(this.validateField({ fieldProps }));
    }, []);

    /* Await for all validation promises to resolve before returning */
    const validatedFields = await Promise.all(validationSequence);

    const isFormValid = !validatedFields.some(({ nextFieldProps }) => {
      return !nextFieldProps.get('expected');
    });

    const { onInvalid } = this.props;

    if (!isFormValid && onInvalid) {
      const { fields: nextFields } = this.state;

      /* Reduce the invalid fields to the ordered Array */
      const invalidFields = List(nextFields.filter(fieldProps => !fieldProps.get('expected')));

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
   * Resets value and state of all the fields.
   */
  reset = () => {
    const nextFields = this.state.fields.map(fieldProps => fieldUtils.resetField(fieldProps));

    this.setState({ fields: nextFields }, () => {
      /* Validate only non-empty fields, since empty required fields should not be unexpected on reset */
      this.validate(fieldProps => (fieldProps.get('value') !== ''));

      /* Call custom callback methods to be able to reset controlled fields */
      const { onReset } = this.props;
      if (onReset) {
        dispatch(onReset, {
          fields: nextFields,
          form: this
        }, this.context);
      }
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

    /* Ensure form should submit (has no unexpected field values) */
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

    invariant(dispatchedAction && (typeof dispatchedAction.then === 'function'),
      'Cannot submit the form. Expecting `action` prop of the Form to return an instance of Promise, but got: %s. ' +
      'Make sure you return a Promise from your action.', dispatchedAction);

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
