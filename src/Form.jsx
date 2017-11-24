import { fromJS, Map } from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';

/* Own modules */
import { TValidationRules } from './FormProvider';
import { isset, fieldUtils, serialize } from './utils';

export default class Form extends React.Component {
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
    onSumbitEnd: PropTypes.func
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
    fields: PropTypes.instanceOf(Map).isRequired,
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
   * @param {object} fieldProps
   * @param {function} afterUpdate Callback to execute after state update.
   */
  updateField = ({ name, fieldProps: directProps, propsPatch = null }) => {
    const { fields } = this.state;
    const fieldProps = directProps || fields.get(name) && fields.get(name).toJS();

    const nextProps = propsPatch ? {
      ...fieldProps,
      ...propsPatch
    } : fieldProps;

    /* Update the validity state of the field */
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
        return resolve({ nextFields, nextProps });
      });
    });
  }

  /**
   * Maps the field to the state (context) explicitly.
   * Passing fields in context gives a benefit of removing an explicit traversing the children
   * tree, deconstructing and constructing each appropriate child with the attached handler props.
   * However, fields present in the composite components are still unkown to the Form. This method
   * is a handler for each unkown field registration attempt.
   * @param {object} fieldProps
   * @param {ReactComponent} fieldComponent
   */
  mapFieldToState = async ({ fieldProps, fieldComponent }) => {
    console.groupCollapsed(fieldProps.name, '@ mapFieldToState');
    console.log('fieldProps', fieldProps);
    console.groupEnd();

    const { fields } = this.state;

    /* Validate the field when it has initial value */
    const shouldValidate = isset(fieldProps.value) && (fieldProps.value !== '');
    if (shouldValidate) this.validateField({ fieldProps });

    const nextFields = fields.mergeIn([fieldProps.name], fromJS({
      ...fieldProps,
      fieldComponent
    }));

    this.setState({ fields: nextFields });
  }

  /**
   * Handles field focus.
   * @param {object} fieldProps
   */
  handleFieldFocus = ({ event, fieldProps }) => {
    console.groupCollapsed(fieldProps.name, '@ handleFieldFocus');
    console.log('fieldProps', fieldProps);
    console.groupEnd();

    this.updateField({
      name: fieldProps.name,
      propsPatch: {
        focused: true
      }
    }).then(({ nextProps }) => {
      const { onFocus } = fieldProps;

      if (onFocus) {
        /* Invoke custom onFocus handler */
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
    }).then(({ nextProps }) => {
      const { onChange } = fieldProps;

      if (onChange) {
        /* Call client-side onChange handler function */
        onChange({ event, nextValue, fieldProps: nextProps, formProps: this.props });
      }
    });
  }

  /**
   * Handles field blur.
   * @param {object} fieldProps
   */
  handleFieldBlur = async ({ event, fieldProps }) => {
    const { disabled: prevDisabled, validated, onBlur } = fieldProps;

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
      await this.validateField({ fieldProps });
    }

    /* Make field enabled, update its props */
    this.updateField({
      name: fieldProps.name,
      propsPatch: {
        focused: false,
        disabled: prevDisabled
      }
    }).then(({ nextProps }) => {
      /* Invoke custom onBlur handler */
      if (onBlur) onBlur({ event, fieldProps: nextProps, formProps: this.props });
    });
  }

  /**
   * Validates a single field.
   * @param {object} fieldProps
   * @return {boolean}
   */
  validateField = async ({ fieldProps, returnValidState = false }) => {
    const { fields } = this.state;
    const { rules: customFormRules } = this.props;
    const { rules: contextFormRules } = this.context;

    const hasExpectedValue = await fieldUtils.isExpected({
      fieldProps,
      fields,
      formProps: this.props,
      formRules: customFormRules || contextFormRules || {}
    });

    console.log('validateField @ hasExpectedValue', hasExpectedValue);

    /* Update the validity state of the field */
    const propsPatch = {
      validated: true,
      expected: hasExpectedValue
    };

    const nextValidState = fieldUtils.updateValidState({
      fieldProps: {
        ...fieldProps,
        ...propsPatch
      }
    });

    if (returnValidState) return nextValidState;

    /* Update the field in the state */
    this.updateField({
      name: fieldProps.name,
      propsPatch: {
        ...propsPatch,
        ...nextValidState
      }
    });

    return hasExpectedValue;
  }

  /**
   * Validates the form.
   * Sequentially goes field by field calling a dedicated field validation method.
   */
  validate = async () => {
    const { fields } = this.state;

    const vmap = fields.reduce((promises, immutableProps) => {
      const fieldProps = immutableProps.toJS();

      if (fieldUtils.shouldValidateField({ fieldProps })) {
        return promises.concat(this.validateField({ fieldProps }));
      }

      return promises.concat(fieldProps.expected);
    }, []);

    return Promise.all(vmap).then((foo) => {
      const shouldSubmit = !foo.some(expected => !expected);
      return shouldSubmit;
    });
  }

  /**
   * Handles form submit.
   * @param {Event} event
   */
  handleFormSubmit = async (event) => {
    event.preventDefault();

    /* Ensure form should submit (has no unexpected field values) */
    const shouldSubmit = await this.validate();
    console.warn('shouldSubmit?', shouldSubmit);

    if (!shouldSubmit) return;

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
        /**
         * Event: Submit has passed.
         */
        if (onSubmit) onSubmit(callbackArgs);
      })
      .catch(() => {
        /**
         * Event: Submit has failed.
         */
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
