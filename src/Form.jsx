import { fromJS, Map } from 'immutable';
import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { TValidationRules } from './FormProvider';
import { fieldUtils, serialize } from './utils';

/* Children components */
import Field from './Fields/Field';

export default class Form extends Component {
  /**
   * Props.
   */
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

  /**
   * State.
   */
  state = {
    fields: Map(),
    isSubmitting: false
  }

  /**
   * Context which is accepted by Form.
   */
  static contextTypes = {
    rules: TValidationRules
  }

  /**
   * Context which Form passes to Fields.
   */
  static childContextTypes = {
    fields: PropTypes.instanceOf(Map),
    mapFieldToState: PropTypes.func,
    handleFieldFocus: PropTypes.func,
    handleFieldBlur: PropTypes.func,
    handleFieldChange: PropTypes.func
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
   * @param {object} fieldProps
   * @param {function} afterUpdate Callback to execute after state update.
   */
  updateField = ({ name, fieldProps: directProps, propsPatch = null }) => {
    const { fields } = this.state;
    const fieldProps = directProps || fields.get(name) && fields.get(name).toJS();

    const nextProps = propsPatch ? { ...fieldProps, ...propsPatch } : fieldProps;

    const nextFields = fields.mergeIn([name], fromJS(nextProps));

    console.groupCollapsed(name, '@ updateField');
    console.log('directProps', directProps);
    console.log('propsPatch', propsPatch);
    console.log('fieldProps', fieldProps);
    console.log('nextProps', nextProps);
    console.log('nextFields:', nextFields.toJS());
    console.groupEnd();

    return new Promise((resolve) => {
      this.setState({ fields: nextFields }, () => {
        return resolve(nextFields);
      });
    });
  }

  /**
   * Map the field to the state (context) explicitly.
   * Passing fields in context gives a benefit of removing an explicit traversing the children
   * tree, deconstructing and constructing each appropriate child with the attached handler props.
   * However, fields present in the composite components are still unkown to the Form. This method
   * is a handler for each unkown field registration attempt.
   */
  mapFieldToState = ({ fieldProps, fieldComponent }) => {
    console.groupCollapsed(fieldProps.name, '@ mapFieldToState');
    console.log('fieldProps', fieldProps);
    console.groupEnd();

    const { fields } = this.state;

    const nextFields = fields.mergeIn([fieldProps.name], fromJS({
      ...fieldProps,
      fieldComponent
    }));

    this.setState({ fields: nextFields });
  }

  /**
   * Validate a single field.
   * Validation of each field is a complex process consisting of several steps.
   * It is important to resolve the validation immediately once the field becomes invalid.
   *
   * @param {object} fieldProps
   * @return {boolean}
   */
  validateField = async (fieldProps) => {
    let isFieldValid = true;
    const { name: fieldName, value, rule, asyncRule } = fieldProps;

    /* Resolve resolvable props */
    const required = fieldUtils.resolveProp({
      propName: 'required',
      fieldProps,
      fields: this.state.fields
    });

    console.groupCollapsed(fieldName, '@ validateField');
    console.log('fieldProps', fieldProps);
    console.log('required:', required);
    console.log('value:', value);

    /* Allow non-required fields to be empty */
    if (!value) {
      console.log('valid:', !required);
      console.groupEnd();

      return !required;
    }

    /* Assume Field doesn't have any specific validation attached */
    const { rules: contextRules } = this.context;
    const { rules: customFormRules } = this.props;
    const formRules = customFormRules || contextRules;
    const formRule = formRules && formRules[fieldName];

    if (!rule && !asyncRule && !formRule ) {
      console.groupEnd();

      return isFieldValid;
    }

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
    if (!isFieldValid) {
      console.groupEnd();

      return isFieldValid;
    }

    /**
     * Field: Asynchronous validation.
     * Each field may have an async rule. The latter is a function which returns a Promise, which is
     * being executed right after.
     */
    if (asyncRule) {
      console.log('Field has asynchronous rule, calling...');

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

    console.log('valid:', isFieldValid);

    /**
     * Form-level validation.
     * The last level of validation is a form-wide validation provided by "rules" property of the Form.
     * The latter property is also inherited from the context passed by FormProvider.
     */
    if (!formRules) {
      console.groupEnd();

      return isFieldValid;
    }

    /**
     * Form-level validation.
     */
    if (!formRule) {
      console.groupEnd();

      return isFieldValid;
    }

    if (formRule) {
      console.log('Field has "formRule":', formRule);
      isFieldValid = formRule(value, this.props);

      console.log('valid:', isFieldValid);
    }

    console.groupEnd();

    return isFieldValid;
  }

  /**
   * Validate form.
   */
  validate = async () => {
    const { fields } = this.state;
    let isFormValid = true;

    await fields.forEach(async (immutableProps) => {
      const fieldProps = immutableProps.toJS();
      let isFieldValid = fieldProps.valid;

      if (fieldUtils.shouldValidateField({ fieldProps })) {
        isFieldValid = await this.validateField(fieldProps);

        this.updateField({
          name: fieldProps.name,
          propsPatch: {
            validated: true,
            valid: isFieldValid
          }
        });
      }

      if (!isFieldValid) {
        isFormValid = isFieldValid;
      }
    });

    console.log('isFormValid', isFormValid);
    return isFormValid;
  }

  /**
   * Determines if the provided field needs validation.
   * By default, each Field has "not-validated" validation status.
   * This means the Field hasn't yet been validated, so the
   * validation is required.
   * @param {object} fieldProps
   * @return {boolean}
   */
  shouldValidateField = ({ valid }) => {
    return (valid === keywords.notValidated);
  }

  /**
   * Handles field focus.
   * @param {object} fieldProps
   */
  handleFieldFocus = ({ fieldProps }) => {
    console.groupCollapsed(fieldProps.name, '@ handleFieldFocus');
    console.log('fieldProps', fieldProps);
    console.groupEnd();

    console.log('')

    this.updateField({
      name: fieldProps.name,
      propsPatch: {
        focused: true
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
    console.groupCollapsed(fieldProps.name, '@ handleFieldChange');
    console.log('fieldProps', fieldProps);
    console.log('nextValue', nextValue);
    console.groupEnd();

    /* Update the value of the changed field in the state */
    this.updateField({
      name: fieldProps.name,
      propsPatch: {
        value: nextValue
      }
    }).then(() => {
      const { onChange } = fieldProps;

      if (onChange) {
        /* Call client-side onChange handler function */
        onChange(event, nextValue, fieldProps, this.props);
      }
    });
  }

  /**
   * Handles field blur.
   * @param {object} fieldProps
   */
  handleFieldBlur = async ({ fieldProps }) => {
    const { valid, disabled: prevDisabled, validated, onBlur } = fieldProps;
    let isFieldValid = valid;

    console.groupCollapsed(fieldProps.name, '@ handleFieldBlur');
    console.log('fieldProps', fieldProps);
    console.groupEnd();

    if (!validated) {
      /* Make field disabled during the validation */
      this.updateField({
        name: fieldProps.name,
        propsPatch: {
          disabled: true
        }
      });

      /* Validate the field */
      isFieldValid = await this.validateField(fieldProps);
    }

    /* Enable field back, update its props */
    this.updateField({
      name: fieldProps.name,
      propsPatch: {
        focused: false,
        disabled: prevDisabled,
        validated: true,
        valid: isFieldValid
      }
    }).then(() => {
      /* Invoke custom onBlur handler */
      if (onBlur) onBlur();
    });
  }

  /**
   * Handles form submit.
   * @param {Event} event
   */
  handleFormSubmit = async (event) => {
    event.preventDefault();

    /**
     * First, ensure all non-validated fields are validated
     * and are valid.
     */
    const isFormValid = await this.validate();
    if (!isFormValid) return;

    const { fields } = this.state;
    const { action, onSubmitStart, onSubmit, onSubmitFailed, onSubmitEnd } = this.props;

    /* Serialize the fields */
    const serialized = serialize(fields);

    const callbackArgs = {
      fields,
      serialized,
      formProps: this.props
    };

    /**
     * Event: Submit has started.
     * The submit is consideres started immediately when the submit button is pressed.
     * This is a good place to have a UI logic dependant on the form submit (i.e. loaders).
     */
    if (onSubmitStart) onSubmitStart(callbackArgs);
    this.setState({ isSubmitting: true });

    /**
     * Perform the action.
     * Form's action is a function which returns a Promise. You should pass a WS call, or async action
     * as a prop to the form in order for it to work.
     */
    action(callbackArgs)
      .then(() => {
        if (onSubmit) onSubmit(callbackArgs);
      })
      .catch(() => {
        if (onSubmitFailed) onSubmitFailed(callbackArgs);
      })
      .then(() => {
        /**
         * Event: Submit has ended.
         * Called each time after the submit, regardless of the submit status (success/failure).
         */
        if (onSubmitEnd) onSubmitEnd(callbackArgs);
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
