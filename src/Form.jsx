import { fromJS, Map } from 'immutable';
import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';

/* Children components */
import Field from './Field';

export default class Form extends Component {
  static propTypes = {
    /* General */
    id: PropTypes.string,
    className: PropTypes.string,

    /* Specific */
    action: PropTypes.func.isRequired,

    /* Events */
    onSumbitStart: PropTypes.func,
    onSumbit: PropTypes.func,
    onSumbitFailed: PropTypes.func,
    onSumbitEnd: PropTypes.func,
  }

  static defaultProps = {
    action: () => new Promise(resolve => resolve())
  }

  state = {
    fields: Map(),
    isSubmitting: false
  }

  /**
   * Context types accepted by form
   */
  static contextTypes = {
    rules: PropTypes.object
  }

  /**
   * Context types passed by the Form to children
   */
  static childContextTypes = {
    fields: PropTypes.instanceOf(Map),
    mapFieldToState: PropTypes.func,
    handleFieldBlur: PropTypes.func,
    handleFieldChange: PropTypes.func
  }

  getChildContext() {
    return {
      fields: this.state.fields,
      mapFieldToState: this.mapFieldToState,
      handleFieldBlur: this.handleFieldBlur,
      handleFieldChange: this.handleFieldChange
    };
  }

  /**
   * Set the props Object to the field with the provided name.
   */
  updateFieldProps = ({ name, props, afterUpdate }) => {
    const { fields } = this.state;
    const nextFields = fields.mergeIn([name], fromJS(props));

    return this.setState({ fields: nextFields }, afterUpdate);
  }

  /**
   * Register the field in the state (context) explicitly.
   * Passing fields in context gives a benefit of removing an explicit traversing the children
   * tree, deconstructing and constructing each appropriate child with the attached handler props.
   * However, fields present in the composite components are still unkown to the Form. This method
   * is a handler for each unkown field registration attempt.
   */
  mapFieldToState = (fieldProps) => {
    const { name } = fieldProps;
    return this.updateFieldProps({ name, props: fieldProps });
  }

  /**
   * Validate a single field.
   * Validation of each field is a complex process consisting of several steps.
   * It is important to resolve the validation immediately once the field becomes invalid.
   */
  validateField = async (fieldProps) => {
    let isFieldValid = true;
    const { name: fieldName, value, rule, asyncRule } = fieldProps;

    /**
     * Format validation.
     * The first step of validation is to ensure a proper format.
     * This is the most basic validation, therefore it should pass first.
     */
    if (rule) {
      /* Test the RegExp against the field's value */
      isFieldValid = rule.test(value);
    }

    /* Invalid format - no need to continue validating */
    if (!isFieldValid) return isFieldValid;

    /**
     * Field: Asynchronous validation.
     * Each field may have an async rule. The latter is a function which returns a Promise, which is
     * being executed right after.
     */
    if (asyncRule) {
      try {
        await asyncRule({
          value,
          fieldProps,
          formProps: this.props
        });
      } catch(error) {
        isFieldValid = false;
      }
    }

    /**
     * Form-level validation.
     * The last level of validation is a form-wide validation provided by "rules" property of the Form.
     * The latter property is also inherited from the context passed by FormProvider.
     */
    const { rules: contextRules } = this.context;
    const { rules: customFormRules } = this.props;
    const formRules = customFormRules || contextRules;
    if (!formRules) return isFieldValid;

    const formRule = formRules[fieldName];
    if (!formRule) return isFieldValid;

    if (formRules.hasOwnProperty(fieldName)) {
      isFieldValid = formRule(value, this.props);
    }

    return isFieldValid;
  }

  /**
   * Determines if the provided field needs validation.
   */
  shouldValidateField = ({ name, rule, asyncRule }) => {
    const { rules: contextRules } = this.context;
    const { rules: customFormRules } = this.props;
    const formRules = customFormRules || contextRules;

    return (
      rule ||
      asyncRule ||
      formRules
    );
  }

  /**
   * Handle field blur.
   */
  handleFieldBlur = async ({ fieldProps }) => {
    const { name, valid, disabled: prevDisabled, onBlur } = fieldProps;
    const shouldValidateField = this.shouldValidateField(fieldProps);
    let isFieldValid = valid;

    if (shouldValidateField) {
      /* Make field disabled during the validation */
      this.updateFieldProps({
        name,
        props: {
          disabled: true
        }
      });

      /* Validate the field */
      isFieldValid = await this.validateField(fieldProps);
    }

    /* Enable field back, update its props */
    this.updateFieldProps({
      name,
      props: {
        disabled: prevDisabled,
        valid: isFieldValid
      },
      afterUpdate: () => {
        /* Invoke custom onBlur handler */
        if (onBlur) onBlur();
      }
    });
  }

  /**
   * Handle field change.
   */
  handleFieldChange = ({ event, fieldProps, nextValue }) => {
    const { name, onChange } = fieldProps;

    /* Update the value of the changed field in the state */
    this.updateFieldProps({
      name,
      props: {
        value: nextValue
      },
      afterUpdate: () => {
        if (onChange) {
          /* Call client-side onChange handler function */
          onChange(event, nextValue, fieldProps, this.props);
        }
      }
    });
  }

  /**
   * Handle form submit.
   */
  handleFormSubmit = (event) => {
    event.preventDefault();

    const { fields } = this.state;
    const { action, onSubmitStart, onSubmit, onSubmitFailed, onSubmitEnd } = this.props;

    const callbackArgs = [fields, this.props];

    /**
     * Event: Submit has started.
     * The submit is consideres started immediately when the submit button is pressed.
     * This is a good place to have a UI logic dependant on the form submit (i.e. loaders).
     */
    if (onSubmitStart) onSubmitStart(...callbackArgs);
    this.setState({ isSubmitting: true });

    /**
     * Perform the action.
     * Form's action is a function which returns a Promise. You should pass a WS call, or async action
     * as a prop to the form in order for it to work.
     */
    action(...callbackArgs)
      .then(() => {
        if (onSubmit) onSubmit(...callbackArgs);
      })
      .catch(() => {
        if (onSubmitFailed) onSubmitFailed(...callbackArgs);
      })
      .then(() => {
        /**
         * Event: Submit has ended.
         * Called each time after the submit, regardless of the submit status (success/failure).
         */
        if (onSubmitEnd) onSubmitEnd(...callbackArgs);
        this.setState({ isSubmitting: false });
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
