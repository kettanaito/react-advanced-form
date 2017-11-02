import { fromJS } from 'immutable';
import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { mapChildrenToFields } from './utils/fields';

/* Children components */
import Field from './Field';

export default class Form extends Component {
  static childContextTypes = {
    handleFieldBlur: PropTypes.func,
    handleFieldChange: PropTypes.func
  }

  getChildContext() {
    return {
      handleFieldBlur: this.handleFieldBlur,
      handleFieldChange: this.handleFieldChange
    };
  }

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
    fields: fromJS(mapChildrenToFields(this.props.children)),
    isSubmitting: false
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
   * Validate a single field.
   */
  validateField = async (fieldProps) => {
    let isFieldValid = true;
    const { value, rule, asyncRule } = fieldProps;

    /* Validate the format */
    if (rule) {
      const { fields } = this.state;

      /* Test the RegExp against the field's value */
      isFieldValid = rule.test(value);
    }

    /* Invalid format - no need to continue validating */
    if (!isFieldValid) return isFieldValid;

    /* Async client-side validation */
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

    return isFieldValid;
  }

  /**
   * Handle field blur.
   */
  handleFieldBlur = async ({ fieldProps }) => {
    const { name, onBlur } = fieldProps;

    /* Make field disabled during the validation */
    this.updateFieldProps({
      name,
      props: {
        disabled: true
      }
    });

    /* Validate the field */
    const isFieldValid = await this.validateField(fieldProps);

    /* Enable field back, update its props */
    this.updateFieldProps({
      name,
      props: {
        disabled: false,
        valid: isFieldValid
      }
    });

    /* Invoke client event handler */
    if (onBlur) onBlur();
  }

  /**
   * Handle field change.
   */
  handleFieldChange = ({ event, fieldProps, nextValue }) => {
    /* Update the value of the changed field in the state */
    this.updateFieldProps({
      name: fieldProps.name,
      props: {
        value: nextValue
      },
      afterUpdate: () => {
          if (fieldProps.onChange) {
            /* Call client-side onChange handler function */
            fieldProps.onChange(event, nextValue, fieldProps, this.props);
          }
      }
    });
  }

  /**
   * Handle form submit
   */
  handleFormSubmit = (event) => {
    event.preventDefault();

    const { fields } = this.state;
    const { action, onSubmitStart, onSubmit, onSubmitFailed, onSubmitEnd } = this.props;

    const formArgs = [fields, this.props];

    /**
     * Event: Submit has started.
     * The submit is consideres started immediately when the submit button is pressed.
     * This is a good place to have a UI logic dependant on the form submit (i.e. loaders).
     */
    if (onSubmitStart) onSubmitStart(...formArgs);
    this.setState({ isSubmitting: true });

    /**
     * Perform the action.
     * Form's action is a function which returns a Promise. You should pass a WS call, or async action
     * as a prop to the form in order for it to work.
     */
    action(...formArgs)
      .then(() => {
        if (onSubmit) onSubmit(...formArgs);
      })
      .catch(() => {
        if (onSubmitFailed) onSubmitFailed(...formArgs);
      })
      .then(() => {
        /**
         * Event: Submit has ended.
         * Called each time after the submit, regardless of the submit status (success/failure).
         */
        if (onSubmitEnd) onSubmitEnd(...formArgs);
        this.setState({ isSubmitting: false });
      });
  }

  /**
   * Render children.
   */
  renderChildren = () => {
    const { fields, isSubmitting } = this.state;
    const { children: formChildren } = this.props;

    const parseChildren = (anyChildren) => {
      return Children.toArray(anyChildren).reduce((nodes, Child) => {
        /* When is not valid React element, do not parse */
        if (!React.isValidElement(Child)) return nodes;

        /* Store initial props of the element */
        const { props: initialProps } = Child;
        const { name: fieldName, children } = initialProps;

        /* Clone props for further mutations */
        let clonedProps = Object.assign({}, initialProps);

        /* Check if Child's type is the Field */
        if (Child.type === Field) {
          const fieldProps = fields.get(fieldName).toJS();
          const { value, disabled, valid } = fieldProps;

          clonedProps = {
            ...clonedProps,
            value,
            valid,
            disabled: disabled || isSubmitting || initialProps.disabled
          };
        }

        /* Parse children recursively */
        let nextChildren = children;

        if (nextChildren) {
          if (Array.isArray(children) || React.isValidElement(children)) {
            nextChildren = parseChildren(children);
          }
        }

        const clonedElement = React.cloneElement(Child, clonedProps, nextChildren);
        return nodes.concat(clonedElement);
      }, []);
    };

    return parseChildren(formChildren);
  }

  render() {
    const { id, className, children } = this.props;

    return (
      <form
        {...{ id }}
        {...{ className }}
        onSubmit={this.handleFormSubmit}
        noValidate>
        {this.renderChildren()}
      </form>
    );
  }
}
