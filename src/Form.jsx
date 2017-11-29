import React from 'react';
import PropTypes from 'prop-types';
import { fromJS, Map } from 'immutable';

/* Internal modules */
import { TValidationRules, TValidationMessages } from './FormProvider';
import { isset, debounce, fieldUtils, IterableInstance } from './utils';

export default class Form extends React.Component {
  /**
   * Props.
   */
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
    onSumbit: PropTypes.func, // form submit went successfully
    onSumbitFailed: PropTypes.func, // form submit failed
    onSumbitEnd: PropTypes.func // form has finished submit (regardless of the result)
  }

  static defaultProps = {
    action: () => new Promise(resolve => resolve())
  }

  /**
   * State.
   */
  state = {
    fields: Map(),
    dynamicFields: Map(),
    submitting: false
  }

  /**
   * Context which is accepted by Form.
   */
  static contextTypes = {
    rules: TValidationRules,
    messages: IterableInstance
  }

  /**
   * Context which Form passes to Fields.
   */
  static childContextTypes = {
    fields: IterableInstance,
    registerField: PropTypes.func.isRequired,
    unregisterField: PropTypes.func.isRequired,
    updateField: PropTypes.func.isRequired,
    handleFieldFocus: PropTypes.func.isRequired,
    handleFieldBlur: PropTypes.func.isRequired,
    handleFieldChange: PropTypes.func.isRequired
  }

  getChildContext() {
    return {
      fields: this.state.fields,
      registerField: this.registerField,
      unregisterField: this.unregisterField,
      updateField: this.updateField,
      handleFieldFocus: this.handleFieldFocus,
      handleFieldBlur: this.handleFieldBlur,
      handleFieldChange: this.handleFieldChange
    };
  }

  /**
   * Getter: Returns the validation rules applicable to the current form.
   */
  get formRules() {
    const { rules: contextRules } = this.context;
    const { rules: formRules } = this.props;

    return formRules || contextRules || Map();
  }

  constructor(props, context) {
    super(props, context);

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
    // const fieldProps = fieldUtils.getFieldProps(fieldPath, fields, directProps);

    const fieldProps = directFieldProps || fields.getIn([fieldPath]);
    const nextFieldProps = propsPatch ? fieldProps.merge(fromJS(propsPatch)) : fieldProps;

    // const nextProps = propsPatch ? {
    //   ...fieldProps,
    //   ...propsPatch
    // } : fieldProps;

    /* Update the validity state of the field */
    const nextFields = fields.mergeIn([fieldProps.get('fieldPath')], nextFieldProps);

    /* FIXME Compose resolved fields */
    const nextResolvedFields = nextFields.map((fieldProps) => {
      const resolvedProps = fieldProps.get('dynamicProps').map((resolver) => {
        return resolver({
          fieldProps: nextFieldProps,
          fields: fields.toJS(),
          formProps: this.props
        });
      });

      return fieldProps.merge(resolvedProps);
    });

    // console.groupCollapsed(fieldProps.get('fieldPath'), '@ updateField');
    // console.log('fieldProps:', fieldProps.toJS());
    // console.log('propsPatch:', propsPatch);
    // console.log('next fieldProps:', nextFieldProps.toJS());
    // console.log('next value:', nextFieldProps.get('value'));
    // console.log('nextFields:', nextFields.toJS());
    // console.log('nextResolvedFields:', nextResolvedFields.toJS());
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
    // console.groupCollapsed(fieldProps.get('fieldPath'), '@ registerField');
    // console.log('fieldProps', fieldProps);
    // console.groupEnd();

    /* Validate the field when it has initial value */
    const shouldValidate = isset(fieldProps.get('value')) && (fieldProps.get('value') !== '');
    if (shouldValidate) this.validateField({ fieldProps });

    this.setState(prevState => ({
      fields: prevState.fields.mergeIn([fieldProps.get('fieldPath')], fieldProps)
    }));
  }

  /**
   * Removes the field's bindings from the Form's state/context.
   * @param {Map} fieldProps
   */
  unregisterField = (fieldProps) => {
    this.setState(prevState => ({
      fields: prevState.fields.deleteIn([fieldProps.get('fieldPath')])
    }));
  }

  /**
   * Handles field focus.
   * @param {Event} event
   * @param {Map} fieldProps
   */
  handleFieldFocus = ({ event, fieldProps }) => {
    // console.groupCollapsed(fieldProps.name, '@ handleFieldFocus');
    // console.log('fieldProps', fieldProps);
    // console.groupEnd();

    this.updateField({
      fieldPath: fieldProps.get('fieldPath'),
      propsPatch: {
        focused: true
      }
    }).then(({ nextFieldProps }) => {
      const onFocus = fieldProps.get('onFocus');

      if (onFocus) {
        /* Call custom onFocus handler */
        onFocus({
          event,
          fieldProps: nextFieldProps,
          formProps: this.props
        });
      }
    });
  }

  /**
   * Handles field change.
   * @param {Event} event
   * @param {Map} fieldProps
   * @param {mixed} nextValue
   */
  handleFieldChange = ({ event, fieldProps, nextValue, prevValue }) => {
    // console.groupCollapsed(fieldProps.name, '@ handleFieldChange');
    // console.log('fieldProps', fieldProps);
    // console.log('nextValue', nextValue);
    // console.groupEnd();

    /* Update the value of the changed field in the state */
    this.updateField({
      fieldProps,
      propsPatch: {
        value: nextValue,
        validatedSync: false,
        validatedAsync: false
      }
    }).then(({ nextFieldProps }) => {
      /* Perform sync field validation on change */
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
          formProps: this.props
        });
      }
    });
  }

  /**
   * Handles field blur.
   * @param {Event} event
   * @param {Map} fieldProps
   */
  handleFieldBlur = async ({ event, fieldProps }) => {
    const fieldPath = fieldProps.get('fieldPath');
    const prevDisabled = fieldProps.get('disabled');
    const value = fieldProps.get('value');
    const expected = fieldProps.get('expected');
    const required = fieldProps.get('required');
    const asyncRule = fieldProps.get('asyncRule');
    const validatedSync = fieldProps.get('validatedSync');
    const validatedAsync = fieldProps.get('validatedAsync');

    /* Determine whether validation is needed */
    /**
     *
     */
    let shouldValidate = !validatedSync || (expected && !validatedAsync && asyncRule);
    const validationType = validatedSync ? 'async' : 'sync';

    /* Skip async validation for empty non-required fields */
    if (!value && !required) {
      shouldValidate = false;
    }

    // console.groupCollapsed(fieldProps.get('name'), '@ handleFieldBlur');
    // console.log('fieldProps', fieldProps);
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
    this.updateField({
      fieldPath,
      propsPatch: {
        focused: false,
        disabled: prevDisabled,
        validating: false
      }
    }).then(({ nextFields, nextFieldProps }) => {
      const onBlur = nextFieldProps.get('onBlur');

      /* Call custom onBlur handler */
      if (onBlur) {
        onBlur({
          event,
          fieldProps: nextFieldProps,
          formProps: this.props
        });
      }

      // TODO Find more efficient way of updating the fields with dynamic props
      nextFields.map((fieldProps) => {
        if (fieldProps.get('dynamicProps').size > 0) {
          this.validateField({ fieldProps });
        }
      });
    });
  }

  /**
   * Validates a single provided field.
   * @param {Map} fieldProps
   * @param {'both'|'async'|'sync'} Validation type.
   * @return {boolean}
   */
  validateField = async ({ type = 'both', fieldProps }) => {
    const { fields } = this.state;

    // console.groupCollapsed(fieldProps.get('name'), '@ validateField');
    // console.log('validation type', type);
    // console.log('value', fieldProps.get('value'));
    // console.log('fieldProps', fieldProps.toJS());
    // console.log('validatedProp', validatedProp);
    // console.groupEnd();
    // console.log(' ');

    const validationArgs = {
      type,
      fieldProps,
      fields,
      formProps: this.props,
      formRules: this.formRules
    };

    /* Perform the respective kind of validation */
    const validationResult = await fieldUtils.validate(validationArgs);
    const { expected } = validationResult;

    /* Update the validity state of the field */
    const propsPatch = {
      expected
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
     * Get next validity state.
     * Based on the changes fieldProps, the field will aquire new validity states (valid/invalid).
     */
    const nextValidityState = fieldUtils.getValidityState({
      fieldProps: fieldProps.merge(fromJS(propsPatch))
    });

    /* Update the field in the state/context to propagate re-render in UI */
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
   * Validates the field in debounce mode.
   */
  debounceValidateField = debounce(this.validateField, 300)

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
    return Promise.all(pendingValidations).then((validatedFields) => {
      return !validatedFields.some(expected => !expected);
    });
  }

  /**
   * Serializes the fields in the Form into a plain Object.
   */
  serialize = () => {
    return fieldUtils.serializeFields(this.state.fields);
  }

  /**
   * Handles form submit.
   * @param {Event} event
   */
  handleFormSubmit = async (event) => {
    event.preventDefault();

    /* Ensure form should submit (has no unexpected field values) */
    const shouldSubmit = await this.validate();
    // console.warn('shouldSubmit?', shouldSubmit);

    if (!shouldSubmit) return;

    const { fields } = this.state;
    const { action, onSubmitStart, onSubmit, onSubmitFailed, onSubmitEnd } = this.props;

    /* Serialize the fields */
    const serialized = this.serialize();

    /* Compose a single Object of arguments passed to each custom handler */
    const callbackArgs = {
      fields,
      serialized: serialized.toJS(),
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
     * Form's action is a function which returns a Promise. You should pass a WS call, or async action
     * as a prop to the form in order for it to work.
     */
    action(callbackArgs).then(() => {
      /* Event: Submit has passed */
      if (onSubmit) onSubmit(callbackArgs);
    }).catch(() => {
      /* Event: Submit has failed */
      if (onSubmitFailed) onSubmitFailed(callbackArgs);
    }).then(() => {
      /**
       * Event: Submit has ended.
       * Called each time after the submit, regardless of the submit status (success/failure).
       */
      if (onSubmitEnd) onSubmitEnd(callbackArgs);
      this.setState({ submitting: false });
    });
  }

  render() {
    const { id, className, children } = this.props;

    return (
      <form
        {...{ id }}
        {...{ className }}
        onSubmit={ this.handleFormSubmit }
        noValidate>
        { children }
      </form>
    );
  }
}
