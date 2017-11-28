/**
 * Connect field.
 * A decorator for custom components for styling over default Field.
 * This decorator will allow to access the field's props from the Form's context
 * from within the custom styling components without having them to subscribe to
 * the context types.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { IterableInstance, fieldUtils } from './utils';
import { defaultProps } from './Fields/Field';

export default function connectField(WrappedComponent) {
  const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  class FieldWrapper extends React.Component {
    static displayName = `ConnectedField(${componentName})`;

    static contextTypes = {
      fieldGroup: PropTypes.string,
      fields: IterableInstance,
      updateField: PropTypes.func.isRequired
    }

    constructor(props, context) {
      super(props, context);

      const { fieldGroup } = context;
      const { name } = props;

      this.fieldPath = fieldUtils.getFieldPath({ name, fieldGroup });
    }

    render() {
      const { fieldPath } = this;
      const { fields } = this.context;
      const directProps = this.props;

      const fieldProps = fields.hasIn([fieldPath]) ? fields.getIn([fieldPath]).toJS() : defaultProps;
      const {
        focused,
        disabled,
        validatedSync,
        validatedAsync,
        validating,
        expected,
        valid,
        validSync,
        validAsync,
        invalid,
        error
      } = fieldProps;

      /* Grab the value from context props when available, to present actual data in the components tree */
      // const value = fields.hasIn([fieldPath]) ? fields.getIn([fieldPath, 'value']) : directProps.value;

      /* Compose the props passed to the decorated component */
      const newProps = {
        ...directProps,
        focused,
        disabled, // doesn't work with dynamic "disabled"
        validating,
        validatedSync,
        validatedAsync,
        expected,
        valid,
        validSync,
        validAsync,
        invalid,
        error
        // value
      };

      return React.createElement(WrappedComponent, newProps);
    }
  }

  return FieldWrapper;
}
