import React from 'react';
import PropTypes from 'prop-types';
import { fromJS, Map } from 'immutable';

/* Internal modules */
import { TValidationRules } from './FormProvider';
import { IterableInstance, isset, fieldUtils } from './utils';

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
    submitting: false
  }

  /**
   * Context which is accepted by Form.
   */
  static contextTypes = {
    rules: TValidationRules,
    messages: PropTypes.instanceOf(Map)
  }

  /**
   * Context which Form passes to Fields.
   */
  static childContextTypes = {
    fields: IterableInstance,
    mapFieldToState: PropTypes.func.isRequired,
    handleFieldFocus: PropTypes.func.isRequired,
    handleFieldBlur: PropTypes.func.isRequired,
    handleFieldChange: PropTypes.func.isRequired
  }

  getChildContext() {
    return {
      fields: this.state.fields,
      mapFieldToState: this.mapFieldToState,
      handleFieldFocus: this.handleFieldFocus,
      handleFieldBlur: this.handleFieldBlur,
      handleFieldChange: this.handleFieldChange
    };
  }

  /**
   * Updates the props of the field stored in the {state.fields} Map.
   * @param {string} name The name of the field.
   * @param {object} fieldProps A directly specified nextProps of the field.
   * @param {object} propsPath A partical Object of the props to merge into the existing field props.
   * @return {Promise<any>}
   */
  updateField = ({ fieldPath, fieldProps: directProps, propsPatch = null }) => {
    const { fields } = this.state;
    const fieldProps = fieldUtils.getFieldProps(fieldPath, fields, directProps);

    const nextProps = propsPatch ? {
      ...fieldProps,
      ...propsPatch
    } : fieldProps;

    /* Update the validity state of the field */
    const nextFields = fields.mergeIn([fieldProps.fieldPath], fromJS(nextProps));

    // console.groupCollapsed(fieldProps.fieldPath, '@ updateField');
    // console.log('directProps', directProps);
    // console.log('propsPatch', propsPatch);
    // console.log('fieldProps', fieldProps);
    // console.log('nextProps', nextProps);
    // console.log('nextFields:', nextFields.toJS());
    // console.groupEnd();

    return new Promise((resolve, reject) => {
      try {
        this.setState({ fields: nextFields }, () => {
          return resolve({ nextFields, nextProps });
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Maps the field to the state/context.
   * Passing fields in context gives a benefit of removing an explicit traversing of children
   * tree, deconstructing and constructing each appropriate child with the attached handler props.
   * @param {object} fieldProps
   */
  mapFieldToState = async ({ fieldProps }) => {
    // console.groupCollapsed(fieldProps.fieldPath, '@ mapFieldToState');
    // console.log('fieldProps', fieldProps);
    // console.groupEnd();

    /* Validate the field when it has initial value */
    const shouldValidate = isset(fieldProps.value) && (fieldProps.value !== '');
    if (shouldValidate) this.validateField({ fieldProps });

    this.setState(prevState => ({
      fields: prevState.fields.mergeIn([fieldProps.fieldPath], fromJS(fieldProps))
    }));
  }

  /**
   * Handles field focus.
   * @param {Event} event
   * @param {object} fieldProps
   */
  handleFieldFocus = ({ event, fieldProps }) => {
    // console.groupCollapsed(fieldProps.name, '@ handleFieldFocus');
    // console.log('fieldProps', fieldProps);
    // console.groupEnd();

    this.updateField({
      fieldPath: fieldProps.fieldPath,
      propsPatch: {
        focused: true
      }
    }).then(({ nextProps }) => {
      const { onFocus } = fieldProps;

      if (onFocus) {
        /* Call custom onFocus handler */
        onFocus({ event, fieldProps: nextProps, formProps: this.props });
      }
    });
  }

  /**
   * Handles field change.
   * @param {Event} event
   * @param {object} fieldProps
   * @param {mixed} nextValue
   */
  handleFieldChange = ({ event, fieldProps, nextValue }) => {
    // console.groupCollapsed(fieldProps.name, '@ handleFieldChange');
    // console.log('fieldProps', fieldProps);
    // console.log('nextValue', nextValue);
    // console.groupEnd();

    /* Update the value of the changed field in the state */
    this.updateField({
      fieldPath: fieldProps.fieldPath,
      propsPatch: {
        value: nextValue,
        validated: false // reset validation status to perform new validation upon change
      }
    }).then(({ nextProps }) => {
      const { onChange } = fieldProps;

      if (onChange) {
        /* Call custom onChange handler */
        onChange({ event, nextValue, fieldProps: nextProps, formProps: this.props });
      }
    });
  }

  /**
   * Handles field blur.
   * @param {Event} event
   * @param {object} fieldProps
   */
  handleFieldBlur = async ({ event, fieldProps }) => {
    const { fieldPath, disabled: prevDisabled, validated, onBlur } = fieldProps;

    // console.groupCollapsed(fieldProps.name, '@ handleFieldBlur');
    // console.log('fieldProps', fieldProps);
    // console.log('should validate', !validated);
    // console.groupEnd();

    if (!validated) {
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
    this.updateField({
      fieldPath,
      propsPatch: {
        focused: false,
        disabled: prevDisabled,
        validating: false
      }
    }).then(({ nextProps }) => {
      /* Call custom onBlur handler */
      if (onBlur) onBlur({ event, fieldProps: nextProps, formProps: this.props });
    });
  }

  /**
   * Validates a single provided field.
   * @param {object} fieldProps
   * @return {boolean}
   */
  validateField = async ({ fieldProps }) => {
    const { fields } = this.state;
    const { rules: customFormRules } = this.props;
    const { rules: contextFormRules } = this.context;

    const validationSummary = await fieldUtils.isExpected({
      fieldProps,
      fields,
      formProps: this.props,
      formRules: customFormRules || contextFormRules || {}
    });
    const { expected } = validationSummary;

    /* Update the validity state of the field */
    const propsPatch = {
      validated: true,
      expected
    };

    /* Get the validation message based on the errorType */
    if (!expected) {
      const errorMessage = fieldUtils.getErrorMessage({
        validationSummary,
        messages: this.context.messages,
        fieldProps,
        formProps: this.props
      });

      propsPatch.error = errorMessage;
    }

    const nextValidityState = fieldUtils.updateValidityState({
      fieldProps: {
        ...fieldProps,
        ...propsPatch
      }
    });

    /* Update the field in the state/context */
    this.updateField({
      fieldPath: fieldProps.fieldPath,
      propsPatch: {
        ...propsPatch,
        ...nextValidityState
      }
    });

    return expected;
  }

  /**
   * Validates the form.
   * Calls the validation on each field in parallel, awaiting for all calls
   * to be resolved before returning the result.
   */
  validate = async () => {
    const pendingValidations = this.state.fields.reduce((validations, immutableField) => {
      const fieldProps = immutableField.toJS();

      /* When field needs validation, do so */
      if (fieldUtils.shouldValidateField({ fieldProps })) {
        return validations.concat(this.validateField({ fieldProps }));
      }

      /* Otherwise return the current expected status of the field */
      return validations.concat(fieldProps.expected);
    }, []);

    /* Await for all validation promises to resolve before returning */
    return Promise.all(pendingValidations).then((validatedFields) => {
      const shouldSubmit = !validatedFields.some(expected => !expected);
      return shouldSubmit;
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
