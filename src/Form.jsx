import { fromJS, Map } from 'immutable';
import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { TValidationRules } from './FormProvider';

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
   * Context types accepted by the form
   */
  static contextTypes = {
    rules: TValidationRules,
    templates: PropTypes.object
  }

  /**
   * Context types passed from the Form to its children
   */
  static childContextTypes = {
    fields: PropTypes.instanceOf(Map),
    templates: PropTypes.object,
    mapFieldToState: PropTypes.func,
    handleFieldBlur: PropTypes.func,
    handleFieldChange: PropTypes.func
  }

  getChildContext() {
    return {
      fields: this.state.fields,
      templates: this.context.templates,
      mapFieldToState: this.mapFieldToState,
      handleFieldBlur: this.handleFieldBlur,
      handleFieldChange: this.handleFieldChange
    };
  }

  /**
   * Updates the props of the field stored in the {state.fields} Map.
   */
  updateField = ({ name, props, afterUpdate }) => {
    const { fields } = this.state;
    const nextFields = fields.mergeIn([name], fromJS(props));

    console.warn('Form @ updateField', name);
    console.log('nextFields:', nextFields.toJS());

    return this.setState({ fields: nextFields }, afterUpdate);
  }

  /**
   * Map the field to the state (context) explicitly.
   * Passing fields in context gives a benefit of removing an explicit traversing the children
   * tree, deconstructing and constructing each appropriate child with the attached handler props.
   * However, fields present in the composite components are still unkown to the Form. This method
   * is a handler for each unkown field registration attempt.
   */
  mapFieldToState = (fieldProps) => {
    const { name } = fieldProps;

    console.warn('Form @ mapFieldToState', name, fieldProps);

    return this.updateField({ name, props: fieldProps });
  }

  /**
   * Validate a single field.
   * Validation of each field is a complex process consisting of several steps.
   * It is important to resolve the validation immediately once the field becomes invalid.
   */
  validateField = async (fieldProps) => {
    let isFieldValid = true;
    const { name: fieldName, value, rule, asyncRule, required } = fieldProps;

    console.warn('Form @ validateField', fieldName, value);

    /* Allow non-required fields to be empty */
    if (!value) return !required

    /**
     * Format validation.
     * The first step of validation is to ensure a proper format.
     * This is the most basic validation, therefore it should pass first.
     */
    if (rule) {
      console.log('Field has "rule":', rule);
      /* Test the RegExp against the field's value */
      isFieldValid = rule.test(value);

      console.log('valid:', isFieldValid);
    }

    /* Invalid format - no need to continue validating */
    if (!isFieldValid) return isFieldValid;

    /**
     * Field: Asynchronous validation.
     * Each field may have an async rule. The latter is a function which returns a Promise, which is
     * being executed right after.
     */
    if (asyncRule) {
      console.log('Field has "asyncRule"');

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

    console.log('valid 3:', isFieldValid);

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

    if (formRule) {
      console.log('Field has "formRule":', formRule);
      isFieldValid = formRule(value, this.props);

      console.log('valid:', isFieldValid);
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

    console.warn('Form @ handleFieldBlur', name, fieldProps.value);

    if (shouldValidateField) {
      console.log('Should validate field! Making it disabled');

      /* Make field disabled during the validation */
      this.updateField({
        name,
        props: {
          disabled: true
        }
      });

      /* Validate the field */
      isFieldValid = await this.validateField(fieldProps);
    }

    console.log('Validation is finished! Field valid:', isFieldValid);

    /* Enable field back, update its props */
    this.updateField({
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

    console.warn('Form @ handleFieldChange', name, nextValue);

    /* Update the value of the changed field in the state */
    this.updateField({
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
