import { fromJS } from 'immutable';
import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { mapChildrenToFields } from './utils/fields';

/* Children components */
import Field from './Field';

export default class Form extends Component {
  static propTypes = {
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

  state = {
    fields: fromJS(mapChildrenToFields(this.props.children)),
    isSubmitting: false
  }

  /**
   * Handle field blur.
   */
  handleFieldBlur = ({ fieldProps }) => {
    /* Validate the field */
    const { name, value, rule, onBlur } = fieldProps;

    if (rule) {
      const { fields } = this.state;

      const wasFieldValid = fields.getIn([name, 'valid']);

      /* Test the RegExp against the field's value */
      const isFieldValid = rule.test(value);

      /* Update the state only when there are changes */
      if (isFieldValid !== wasFieldValid) {
        const nextFields = fields.setIn([name, 'valid'], isFieldValid);
        this.setState({ fields: nextFields });
      }
    }

    /* Invoke custom blur handler */
    if (onBlur) onBlur();
  }

  /**
   * Handle field change.
   */
  handleFieldChange = ({ event, fieldProps, nextValue }) => {
    const { fields } = this.state;

    /* Update the value of the changed field */
    const nextFields = fields.setIn([fieldProps.name, 'value'], nextValue);

    this.setState({ fields: nextFields }, () => {
      if (fieldProps.onChange) {
        /* Call client-side onChange handler function */
        fieldProps.onChange(event, nextValue, fieldProps, this.props);
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

        /* Check if Child's type is supported (is field) */
        if (Child.type === Field) {
          const fieldValue = fields.getIn([fieldName, 'value']);
          const isFieldValid = fields.getIn([fieldName, 'valid']);

          clonedProps = {
            ...clonedProps,
            value: fieldValue,
            valid: isFieldValid,
            disabled: isSubmitting || initialProps.disabled
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
