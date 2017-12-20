import invariant from 'invariant';
import React from 'react';
import PropTypes from 'prop-types';
import { fromJS, Map } from 'immutable';

/* Internal modules */
import validationTypes from './const/validation-types';
import { BothValidationType, SyncValidationType } from './ValidationType';
import { TValidationRules, TValidationMessages } from './FormProvider';
import { isset, debounce, fieldUtils, IterableInstance } from './utils';

export default class Form extends React.Component {
  static propTypes = {
    /* General */
    id: PropTypes.string,
    className: PropTypes.string,

    /* Specific */
    action: PropTypes.func.isRequired, // handle form's action invoked as a submit handling function
    messages: TValidationMessages,
    rules: TValidationRules,

    /* Events */
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
    submitting: false
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
  defineFormRules() {
    const { rules: contextRules } = this.context;
    const { rules: mutableFormRules } = this.props;

    if (!mutableFormRules) return contextRules || Map();

    const formRules = fromJS(mutableFormRules);
    const highestRules = formRules || contextRules || Map();

    return formRules.get('extend') ? contextRules.mergeDeep(formRules) : highestRules;
  }

  constructor(props, context) {
    super(props, context);

    /**
     * Define validation rules.
     */
    this.formRules = this.defineFormRules();

    /**
     * Define validation messages once, since those should be converted to immutable, which is a costly procedure.
     * Moreover, messages are unlikely to change during the component's lifecycle. It should be safe to store them.
     * Note: Messages passed from FormProvider are already immutable.
     */
    const { messages: formMessages } = this.props;
    this.formMessages = formMessages ? fromJS(formMessages) : this.context.messages;
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
        enforceProps: true
      });
    }

    return this.setState({ fields: fields.mergeIn([fieldPath], fieldProps) });
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
  updateField = ({ fieldPath, fieldProps: directFieldProps, propsPatch = null }) => {
    const { fields } = this.state;
    const fieldProps = directFieldProps || fields.getIn([fieldPath]);
    const nextFieldProps = propsPatch ? fieldProps.merge(fromJS(propsPatch)) : fieldProps;

    /* Update the validity state of the field */
    const nextFields = fields.mergeIn([fieldProps.get('fieldPath')], nextFieldProps);

    // FIXME Compose resolved fields
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
          nextFields: nextResolvedFields,
          nextFieldProps
        }));
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Removes the field's bindings from the Form's state/context.
   * @param {Map} fieldProps
   */
  unregisterField = (fieldProps) => {
    return this.setState(prevState => ({
      fields: prevState.fields.deleteIn([fieldProps.get('fieldPath')])
    }));
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
   * @param {string} valueProp Property name to be treated as "value" (i.e. "checked").
   */
  handleFieldChange = async ({ event, fieldProps, nextValue, prevValue, valueProp = 'value' }) => {
    /* Bypass events called from an unregistered Field */
    if (!this.isRegistered(fieldProps)) return;

    console.groupCollapsed(fieldProps.get('fieldPath'), '@ handleFieldChange');
    console.log('fieldProps', Object.assign({}, fieldProps.toJS()));
    console.log('nextValue', nextValue);
    console.groupEnd();

    /**
     * Update the value of the changed field.
     * Also, reset all validation statuses since those are useless after the value has changed. This is important for
     * validation chain, as proper validation statuses trigger proper validations.
     */
    const { nextFields, nextFieldProps } = await this.updateField({
      fieldProps,
      propsPatch: {
        [valueProp]: nextValue,
        validSync: false,
        validAsync: false,
        validatedSync: false,
        validatedAsync: false
      }
    });

    /**
     * Perform appropriate field validation.
     * When field has a value set, perform debounced sync validation. For the cases the user clear the field instantly
     * perform the corresponding immediate sync validation.
     */
    const appropriateValidation = nextFieldProps.get('value') ? this.debounceValidateField : this.validateField;
    appropriateValidation({
      type: SyncValidationType,
      fieldProps: nextFieldProps
    });

    const onChange = fieldProps.get('onChange');

    if (onChange) {
      /* Call custom onChange handler */
      onChange({
        event,
        nextValue,
        prevValue,
        fieldProps: nextFieldProps.toJS(),
        fields: nextFields.toJS(),
        form: this
      });
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
    const prevDisabled = fieldProps.get('disabled');
    const asyncRule = fieldProps.get('asyncRule');
    const validSync = fieldProps.get('validSync');
    const validatedSync = fieldProps.get('validatedSync');
    const validatedAsync = fieldProps.get('validatedAsync');

    /**
     * Determine whether the validation is needed.
     * Also, determine a type of the validation. In case the field has been validated sync and is valid sync, it's
     * ready to be validated async (if any async validation is present). However, if the field hasn't been validated
     * sync yet (hasn't been touched), first require sync validation. When the latter fails, user will be prompted
     * to change the value of the field. Changing the value resets the "async" validation state as well. Hence, when
     * the user will pass sync validation, upon blurring out the field, the validation type will be "async".
     */
    const shouldValidate = !validatedSync || (validSync && !validatedAsync && asyncRule);

    console.groupCollapsed(fieldProps.get('fieldPath'), '@ handleFieldBlur');
    console.log('fieldProps', Object.assign({}, fieldProps.toJS()));
    console.log('should validate', shouldValidate);
    console.groupEnd();

    if (shouldValidate) {
      /* Make field disabled during the validation */
      this.updateField({
        fieldPath,
        propsPatch: {
          disabled: true,
          valid: false,
          invalid: false,
          validating: true
        }
      });

      /* Validate the field */
      await this.validateField({ fieldProps });
    }

    /* Make field enabled, update its props */
    const { nextFields, nextFieldProps } = await this.updateField({
      fieldPath,
      propsPatch: {
        focused: false,
        disabled: prevDisabled,
        validating: false
      }
    });

    const onBlur = nextFieldProps.get('onBlur');

    /* Call custom onBlur handler */
    if (onBlur) {
      onBlur({
        event,
        fieldProps: nextFieldProps.toJS(),
        fields: nextFields.toJS(),
        form: this
      });
    }

    // TODO Find more efficient way of updating the fields with dynamic props
    nextFields.map((fieldProps) => {
      if (fieldProps.has('dynamicProps')) {
        this.validateField({ fieldProps });
      }
    });
  }

  /**
   * Validates a single provided field.
   * @param {Map} fieldProps
   * @param {ValidationType} type
   * @param {boolean} enforceProps Use direct props explicitly, without trying to grab props from the state.
   * @return {boolean}
   */
  validateField = async ({ type = BothValidationType, fieldProps: directFieldProps, enforceProps = false }) => {
    const { formRules } = this;
    const { fields } = this.state;
    const fieldProps = enforceProps
      ? directFieldProps
      : fields.getIn([directFieldProps.get('fieldPath')]) || directFieldProps;

    /* Bypass the validation if the provided validation type has been already validated */
    const shouldValidate = fieldUtils.shouldValidate({
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
    if (!shouldValidate) return true;

    const validationArgs = {
      type,
      fieldProps,
      fields,
      form: this,
      formRules
    };

    /* Perform the respective kind of validation */
    const validationResult = await fieldUtils.validate(validationArgs);

    /* Update the validity state of the field */
    const propsPatch = validationResult;

    /* Get the validation message based on the validation summary */
    if (!validationResult.expected) {
      const errorMessage = fieldUtils.getErrorMessage({
        validationResult,
        messages: this.formMessages,
        fieldProps,
        fields,
        form: this
      });

      propsPatch.error = errorMessage;
    }

    /**
     * Get the next validity state.
     * Based on the changed fieldProps, the field will aquire new validity state (valid/invalid).
     */
    const nextValidityState = fieldUtils.getValidityState(fieldProps.merge(fromJS(propsPatch)));

    /* Update the field in the state to reflect the changes */
    this.updateField({
      fieldProps,
      propsPatch: {
        ...propsPatch,
        ...nextValidityState
      }
    });

    return validationResult.expected;
  }

  /**
   * Validates the field in the debounce mode.
   * That applies that in case multiple calls of this method will be executed, each next within the given timeout
   * duration period postpones the method's execution.
   */
  debounceValidateField = debounce(this.validateField, 250, false)

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
    const pendingValidations = validatingFields.reduce((validations, fieldProps) => {
      return validations.concat(this.validateField({ fieldProps }));
    }, []);

    /* Await for all validation promises to resolve before returning */
    const validatedFields = await Promise.all(pendingValidations);

    const isFormValid = !validatedFields.some(expected => !expected);

    const { onInvalid } = this.props;

    if (!isFormValid && onInvalid) {
      const { fields: nextFields } = this.state;
      const nextMutableFields = nextFields.toJS();

      /* Reduce the invalid fields to the ordered Array */
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
   * Resets the fields in the form.
   */
  reset = () => {
    const nextFields = this.state.fields.map(fieldProps => fieldUtils.resetField(fieldProps));
    this.setState({ fields: nextFields }, () => {
      /* Validate only non-empty fields, since empty required fields should not be unexpected on reset */
      this.validate(fieldProps => (fieldProps.get('value') !== ''));
    });
  }

  /**
   * Serializes the fields in the Form into a plain Object.
   */
  serialize = () => {
    return fieldUtils.serializeFields(this.state.fields).toJS();
  }

  /**
   * Handles form submit.
   * @param {Event} event
   */
  submit = async (event) => {
    if (event) event.preventDefault();

    /* Throw on submit attempt without "action" prop */
    const { action } = this.props;
    invariant(action, `Cannot submit the form without \`action\` prop specified explicitly. Expected a function which returns Promise, but received: ${action}.`);

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
    this.setState({ submitting: true });

    /**
     * Perform the action.
     * Form's action is a function which returns a Promise. You must pass a req, or async action
     * as a prop to the form in order for it to work.
     */
    action(callbackArgs).then((res) => {
      /* Event: Submit has passed */
      if (onSubmitted) {
        onSubmitted({
          ...callbackArgs,
          res
        });
      }

      return res;
    }).catch((res) => {
      /* Event: Submit has failed */
      if (onSubmitFailed) {
        onSubmitFailed({
          ...callbackArgs,
          res
        });
      }

      return res;
    }).then((res) => {
      /**
       * Event: Submit has ended.
       * Called each time after the submit regardless of the its status (success/failure).
       */
      if (onSubmitEnd) {
        onSubmitEnd({
          ...callbackArgs,
          res
        });
      }

      this.setState({ submitting: false });
    });
  }

  render() {
    const { id, className, children } = this.props;

    return (
      <form
        {...{ id }}
        {...{ className }}
        onSubmit={ this.submit }
        noValidate>
        { children }
      </form>
    );
  }
}
