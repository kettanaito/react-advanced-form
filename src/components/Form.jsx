import invariant from 'invariant';
import React from 'react';
import PropTypes from 'prop-types';
import { fromJS, Map } from 'immutable';

/* Internal modules */
import { BothValidationType, SyncValidationType } from '../classes/ValidationType';
import { TValidationRules, TValidationMessages } from './FormProvider';
import { isset, debounce, fieldUtils, IterableInstance } from '../utils';

export default class Form extends React.Component {
  static propTypes = {
    /* General */
    innerRef: PropTypes.func,
    action: PropTypes.func.isRequired, // handle form's action invoked as a submit handling function

    /* Validation */
    rules: TValidationRules, // validation rules
    messages: TValidationMessages, // validation messages

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
    dirty: false
  }

  /* Context which is accepted by Form */
  static contextTypes = {
    rules: IterableInstance,
    messages: IterableInstance
  }

  /* Context which Form passes to Fields */
  static childContextTypes = {
    fields: IterableInstance,
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
      registerField: this.registerField,
      updateField: this.updateField,
      unregisterField: this.unregisterField,
      handleFieldFocus: this.handleFieldFocus,
      handleFieldBlur: this.handleFieldBlur,
      handleFieldChange: this.handleFieldChange
    };
  }

  /**
   * Returns form rules based on the priority of the provided rulesa and the necessity to extend them.
   */
  defineRules() {
    const { rules: contextRules } = this.context;
    const { rules: mutableFormRules } = this.props;

    if (!mutableFormRules) return (contextRules || Map());

    const formRules = fromJS(mutableFormRules);
    const highestRules = formRules || contextRules || Map();

    return formRules.get('extend') ? contextRules.mergeDeep(formRules) : highestRules;
  }

  constructor(props, context) {
    super(props, context);

    /* Define validation rules */
    this.formRules = this.defineRules();

    /**
     * Define validation messages once, since those should be converted to immutable, which is an expensive procedure.
     * Moreover, messages are unlikely to change during the component's lifecycle. It should be safe to store them.
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
    const { fields } = this.state;
    const fieldPath = fieldProps.get('fieldPath');
    const isAlreadyExist = fields.hasIn([fieldPath]);
    const isRadioButton = (fieldProps.get('type') === 'radio');

    console.groupCollapsed(fieldPath, '@ registerField');
    console.log('fieldProps', fieldProps.toJS());
    console.log('already exists:', isAlreadyExist);
    console.groupEnd();

    /* Warn upon duplicate registrations */
    if (isAlreadyExist && !isRadioButton) {
      return console.warn(`Cannot register field \`${fieldProps.get('fieldPath')}\`, the field with the provided name is already registered. Make sure the fields on the same level of \`Form\` or \`Field.Group\` have unique names.`);
    }

    if (isRadioButton && isAlreadyExist) {
      const existingValue = fields.getIn([fieldPath, 'value']);
      if (existingValue) return;

      const currentValue = fieldProps.get('value');

      if (currentValue) {
        fieldProps = fieldProps.set('value', currentValue);
      }
    }

    /* Validate the field when it has initial value */
    const shouldValidate = isset(fieldProps.get('value')) && (fieldProps.get('value') !== '');
    if (shouldValidate) {
      this.validateField({
        fieldProps,
        forceProps: true
      });
    }

    const nextFields = fields.mergeIn([fieldPath], fieldProps);
    return this.setState({ fields: nextFields });
  }

  /**
   * Shorthand: Checks if the provided field is registered in the state.
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
   * @param {object} propsPath A partical Object of the props to merge into the existing field props.
   * @return {Promise<any>}
   */
  updateField = ({ fieldPath, fieldProps: customFieldProps, propsPatch = null }) => {
    const { fields } = this.state;
    const fieldProps = customFieldProps || fields.getIn([fieldPath]);

    const nextFieldProps = propsPatch ? fieldProps.merge(fromJS(propsPatch)) : fieldProps;

    /* Update the validity state of the field */
    const nextFields = fields.mergeIn([fieldProps.get('fieldPath')], nextFieldProps);

    //
    //
    // FIXME Update the fields with dynamic props
    //
    //
    const nextResolvedFields = nextFields.map((fieldProps) => {
      if (!fieldProps.has('dynamicProps')) return fieldProps;

      const resolvedProps = fieldProps.get('dynamicProps').map((resolver) => {
        return resolver({
          fieldProps: nextFieldProps.toJS(),
          fields: nextFields.toJS(),
          form: this
        });
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

    const onFocus = fieldProps.get('onFocus');

    if (onFocus) {
      /* Call custom onFocus handler */
      onFocus({
        event,
        fieldProps: nextFieldProps.toJS(),
        fields: nextFields.toJS(),
        form: this
      });
    }
  }

  /**
   * Handles field change.
   * @param {Event} event
   * @param {Map} fieldProps
   * @param {mixed} prevValue
   * @param {mixed} nextValue
   */
  handleFieldChange = async ({ event, fieldProps, nextValue, prevValue }) => {
    /* Bypass events called from an unregistered Field */
    if (!this.isRegistered(fieldProps)) return;

    console.groupCollapsed(fieldProps.get('fieldPath'), '@ Form @ handleFieldChange');
    console.log('fieldProps', Object.assign({}, fieldProps.toJS()));
    console.log('nextValue', nextValue);
    console.groupEnd();

    /**
     * Handle "onChange" events dispatched by controlled field.
     * Controlled field must execute its custom "CustomField.props.onChange" handler since that
     * is the updater for the state/etc. controlling its value. Internal RAF change handling
     * must be omitted in that scenario, as it will bubble to it eventually via
     * "createField.Field.componentReceiveProps()", when comparing previous and next values of
     * controlled fields.
     */
    const isChangeEvent = event && !((event.nativeEvent || event).isManualUpdate);
    const controllable = fieldProps.get('controllable');
    const onChangeHandler = fieldProps.get('onChange');

    if (isChangeEvent && controllable) {
      console.log('controlled and from change event, call Field.props.onChange directly...');

      invariant(onChangeHandler, 'Cannot update the controlled field `%s`. Expected custom `onChange` handler, but received: %s.', fieldProps.get('name'), onChangeHandler);

      return onChangeHandler({
        event,
        nextValue,
        prevValue,
        fieldProps: fieldProps.toJS(),
        fields: this.state.fields.toJS(),
        form: this
      });
    }

    const valuePropName = fieldProps.get('valuePropName');

    /**
     * Update the value of the changed field.
     * Also, reset all validation states since those are useless after the value has changed.
     * This is important forvalidation chain, as proper validation statuses trigger proper validations.
     */
    const { nextFields, nextFieldProps: updatedFieldProps } = await this.updateField({
      fieldProps,
      propsPatch: {
        [valuePropName]: nextValue,

        /* Reset previous validation states */
        validating: false,
        validSync: false,
        validAsync: false,
        validatedSync: false,
        validatedAsync: false
      }
    });

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
    const appropriateValidation = (prevValue && nextValue)
      ? this.debounceValidateField
      : this.validateField;

    const { nextFieldProps: validatedFieldProps } = await appropriateValidation({
      type: SyncValidationType,
      fieldProps: updatedFieldProps,
      forceProps: true
    });

    /**
     * Call custom "onChange" handler for uncontrolled fields only.
     * Controlled fields dispatch "onChange" handler at the beginning of "Form.handleFieldChange".
     * There is no need to dispatch the handler method once more.
     */
    if (!controllable && onChangeHandler) {
      onChangeHandler({
        event,
        nextValue,
        prevValue,
        fieldProps: validatedFieldProps.toJS(),
        fields: nextFields.toJS(),
        form: this
      });
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
    // TODO Review if this is really needed. Why not just "validationType.shouldValidate()"?
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
      onBlur({
        event,
        fieldProps: nextFieldProps.toJS(),
        fields: nextFields.toJS(),
        form: this
      });
    }

    //
    //
    // TODO Find more efficient way of updating the fields with dynamic props
    //
    //
    nextFields.map((fieldProps) => {
      if (fieldProps.has('dynamicProps')) {
        this.validateField({ fieldProps });
      }
    });
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

    console.groupCollapsed(fieldProps.get('fieldPath'), '@ validateField');
    console.log('validation type', type);
    console.log('value', fieldProps.get('value'));
    console.log('fieldProps', Object.assign({}, fieldProps.toJS()));
    console.log('shouldValidate', shouldValidate);
    console.groupEnd();

    /* Bypass unnecessary validation */
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

    /* Update the validity state of the field */
    let propsPatch = validationResult.get('propsPatch');
    const expected = propsPatch.get('expected');

    /* Determine if there are any messages available to form */
    const { messages } = this;
    const hasMessages = messages && (messages.size > 0);

    /* Get the validation message based on the validation result */
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
     * Get the next validity state.
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
   * Validates the field in the debounce mode.
   * That applies that in case multiple calls of this method will be executed, each next within the
   * given timeout duration period postpones the method's execution.
   */
  debounceValidateField = debounce(this.validateField, 250)

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

    console.log('validatedFields', validatedFields);

    const isFormValid = !validatedFields.some(({ nextFieldProps }) => {
      return !nextFieldProps.get('expected');
    });

    const { onInvalid } = this.props;

    if (!isFormValid && onInvalid) {
      const { fields: nextFields } = this.state;
      const nextMutableFields = nextFields.toJS();

      /* Reduce the invalid fields to the ordered Array */
      //
      //
      // TODO This can be done using immutable instance as well, no need for conversion here
      //
      //
      const invalidFields = Object.keys(nextMutableFields).reduce((invalidFields, fieldName) => {
        const fieldProps = nextMutableFields[fieldName];
        return fieldProps.expected ? invalidFields : invalidFields.concat(fieldProps);
      }, []);

      /* Call custom callback */
      onInvalid({
        fields: nextMutableFields,
        invalidFields,
        form: this
      });
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
        onReset({
          fields: nextFields,
          form: this
        });
      }
    });
  }

  /**
   * Serializes the fields' values into a plain Object.
   */
  serialize = () => {
    return fieldUtils.serializeFields(this.state.fields).toJS();
  }

  /**
   * Submits the form.
   * @param {Event} event
   */
  submit = async (event) => {
    if (event) event.preventDefault();

    /* Throw on submit attempt without the "action" prop */
    const { action } = this.props;
    invariant(action, 'Cannot submit the form without `action` prop specified explicitly. Expected a function which returns Promise, but received: %s.', action);

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
      fields: fields.toJS(),
      form: this
    };

    /**
     * Event: Submit has started.
     * The submit is consideres started immediately when the submit button is pressed.
     * This is a good place to have a UI logic dependant on the form submit (i.e. loaders).
     */
    if (onSubmitStart) onSubmitStart(callbackArgs);

    /**
     * Perform the action.
     * Form's action is a function which returns a Promise. You must pass a req, or async action
     * as a prop to the form in order for it to work.
     */
    const dispatchedAction = action(callbackArgs);

    invariant(dispatchedAction && (typeof dispatchedAction.then === 'function'),
      'Cannot submit the form. Expecting `action` prop of the Form to return an instance ' +
      'of Promise, but got: %s. Make sure you return a Promise from your action.',
      dispatchedAction);

    return dispatchedAction.then((res) => {
      if (onSubmitted) onSubmitted({ ...callbackArgs, res });

      return res;
    }).catch((res) => {
      if (onSubmitFailed) onSubmitFailed({ ...callbackArgs, res });

      return res;
    }).then((res) => {
      if (onSubmitEnd) onSubmitEnd({ ...callbackArgs, res });
    });
  }

  render() {
    const { innerRef, id, className, children } = this.props;

    return (
      <form
        ref={ innerRef }
        { ...{ id } }
        { ...{ className } }
        onSubmit={ this.submit }
        noValidate>
        { children }
      </form>
    );
  }
}
