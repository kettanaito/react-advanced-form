import React from 'react';
import PropTypes from 'prop-types';
import { fromJS, Map } from 'immutable';

/* Internal modules */
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
    onSumbitStart: PropTypes.func, // form should submit, submit started
    onSumbitted: PropTypes.func, // form submit went successfully
    onSumbitFailed: PropTypes.func, // form submit failed
    onSumbitEnd: PropTypes.func // form has finished submit (regardless of the result)
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
    rules: TValidationRules,
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
   * Getter: Returns the validation rules applicable to the current form.
   */
  get formRules() {
    return this.props.rules || this.context.rules || Map();
  }

  constructor(props, context) {
    super(props, context);

    /**
     * Define validation messages once, since those should be converted to immutable, which is a costly procedure.
     * Moreover, messages are unlikely to change during the component's lifecycle. It should be safe to store them.
     */
    const { messages: customMessage } = this.props;
    this.formMessages = customMessage ? fromJS(customMessage) : this.context.messages;
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
          formProps: this.props
        });
      });

      return fieldProps.merge(resolvedProps);
    });

    // console.groupCollapsed(fieldProps.get('fieldPath'), '@ updateField');
    // console.log('fieldProps:', Object.assign({}, fieldProps.toJS()));
    // console.log('propsPatch:', propsPatch);
    // console.log('next fieldProps:', Object.assign({}, nextFieldProps.toJS()));
    // console.log('next value:', nextFieldProps.get('value'));
    // console.log('nextFields:', Object.assign({}, nextFields.toJS()));
    // console.log('nextResolvedFields:', Object.assign({}, nextResolvedFields.toJS()));
    // console.groupEnd();

    return new Promise((resolve, reject) => {
      try {
        this.setState({ fields: nextResolvedFields }, () => resolve({
          nextFields,
          nextFieldProps
        }));
      } catch (error) {
        return reject(error);
      }
    });
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

    // console.groupCollapsed(fieldPath, '@ registerField');
    // console.log('fieldProps', fieldProps.toJS());
    // console.log('already exists:', fields.hasIn([fieldPath]));
    // console.groupEnd();

    /* Warn upon duplicate registrations */
    if (fields.hasIn([fieldPath]) && (fieldProps.get('type') !== 'radio')) {
      return console.warn(`Cannot register field \`${fieldProps.get('fieldPath')}\`, the field with the provided name is already registered. Make sure the fields on the same level of \`Form\` or \`Field.Group\` have unique names, unless it's intentional.`);
    }

    /* Validate the field when it has initial value */
    const shouldValidate = isset(fieldProps.get('value')) && (fieldProps.get('value') !== '');
    if (shouldValidate) this.validateField({ fieldProps });

    return this.setState({ fields: fields.mergeIn([fieldPath], fieldProps) });
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
    // console.groupCollapsed(fieldProps.name, '@ handleFieldFocus');
    // console.log('fieldProps', fieldProps);
    // console.groupEnd();

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
        formProps: this.props
      });
    }
  }

  /**
   * Handles field change.
   * @param {Event} event
   * @param {Map} fieldProps
   * @param {mixed} nextValue
   */
  handleFieldChange = async ({ event, fieldProps, nextValue, prevValue }) => {
    // console.groupCollapsed(fieldProps.get('fieldPath'), '@ handleFieldChange');
    // console.log('fieldProps', Object.assign({}, fieldProps.toJS()));
    // console.log('nextValue', nextValue);
    // console.groupEnd();

    /**
     * Update the value of the changed field.
     * Also, reset all validation statuses since those are useless after the value has changed. This is important for
     * validation chain, as proper validation statuses trigger proper validations.
     */
    const { nextFields, nextFieldProps } = await this.updateField({
      fieldProps,
      propsPatch: {
        value: nextValue,
        validSync: false,
        validAsync: false,
        validatedSync: false,
        validatedAsync: false
      }
    });

    /* Perform debounced sync field validation */
    this.debounceValidateField({
      type: 'sync',
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
        formProps: this.props
      });
    }
  }

  /**
   * Handles field blur.
   * @param {Event} event
   * @param {Map} fieldProps
   */
  handleFieldBlur = async ({ event, fieldProps }) => {
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
    const validationType = (validatedSync && validSync) ? 'async' : 'sync';

    // console.groupCollapsed(fieldProps.get('name'), '@ handleFieldBlur');
    // console.log('fieldProps', Object.assign({}, fieldProps.toJS()));
    // console.log('validationType', validationType);
    // console.log('should validate', shouldValidate);
    // console.groupEnd();

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
      await this.validateField({
        type: validationType,
        fieldProps
      });
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
        formProps: this.props
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
   * @param {'both'|'async'|'sync'} Validation type.
   * @return {boolean}
   */
  validateField = async ({ type = 'both', fieldProps }) => {
    // console.groupCollapsed(fieldProps.get('fieldPath'), '@ validateField');
    // console.log('validation type', type);
    // console.log('value', fieldProps.get('value'));
    // console.log('fieldProps', Object.assign({}, fieldProps.toJS()));
    // console.groupEnd();
    // console.log(' ');

    const validationArgs = {
      type,
      fieldProps,
      fields: this.state.fields,
      formProps: this.props,
      formRules: this.formRules
    };

    /* Perform the respective kind of validation */
    const validationResult = await fieldUtils.validate(validationArgs);
    const { expected } = validationResult;

    /* Update the validity state of the field */
    const propsPatch = {
      expected,
      error: null
    };

    /* Update the corresponding validation properties */
    if (['both', 'sync'].includes(type)) {
      propsPatch.validatedSync = true;
      propsPatch.validSync = expected;
    }

    if (['both', 'async'].includes(type)) {
      propsPatch.validatedAsync = true;
      propsPatch.validAsync = expected;
    }

    /* Get the validation message based on the validation summary */
    if (!expected) {
      const errorMessage = fieldUtils.getErrorMessage({
        validationResult,
        messages: this.formMessages,
        fieldProps,
        formProps: this.props
      });

      propsPatch.error = errorMessage;
    }

    /**
     * Get the next validity state.
     * Based on the changed fieldProps, the field will aquire new validity state (valid/invalid).
     */
    const nextValidityState = fieldUtils.getValidityState({
      fieldProps: fieldProps.merge(fromJS(propsPatch))
    });

    /* Update the field in the state to reflect the changes */
    this.updateField({
      fieldProps,
      propsPatch: {
        ...propsPatch,
        ...nextValidityState
      }
    });

    return expected;
  }

  /**
   * Validates the field in the debounce mode.
   * That applies that in case multiple calls of this method will be executed, each next within the given timeout
   * duration period postpones the method's execution.
   */
  debounceValidateField = debounce(this.validateField, 300, true)

  /**
   * Validates the form.
   * Calls the validation on each field in parallel, awaiting for all calls
   * to be resolved before returning the result.
   */
  validate = async () => {
    const pendingValidations = this.state.fields.reduce((validations, fieldProps) => {
      /* When field needs validation, do so */
      if (fieldUtils.shouldValidate(fieldProps)) {
        return validations.concat(this.validateField({ fieldProps }));
      }

      /* Otherwise return the current expected status of the field */
      return validations.concat(fieldProps.get('expected'));
    }, []);

    /* Await for all validation promises to resolve before returning */
    const validatedFields = await Promise.all(pendingValidations);

    return !validatedFields.some(expected => !expected);
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

    /* Ensure form should submit (has no unexpected field values) */
    const shouldSubmit = await this.validate();
    if (!shouldSubmit) return;

    const { fields } = this.state;
    const { action, onSubmitStart, onSubmitted, onSubmitFailed, onSubmitEnd } = this.props;

    /* Serialize the fields */
    const serialized = this.serialize();

    /* Compose a single Object of arguments passed to each custom handler */
    const callbackArgs = {
      serialized,
      fields: fields.toJS(),
      formProps: this.props
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
      if (onSubmit) {
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
