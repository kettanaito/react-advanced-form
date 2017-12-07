/**
 * Connect field.
 * A decorator for custom components for styling over default Field.
 * This decorator will allow to access the field's props from the Form's context
 * from within the custom styling components without having them to subscribe to
 * the context types.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { isset, getProperty, IterableInstance, fieldUtils } from './utils';
import { defaultProps as defaultFieldProps } from './Fields/Field';

export default function connectField(WrappedComponent) {
  const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  class FieldWrapper extends React.Component {
    static displayName = `connectField(${componentName})`;

    static contextTypes = {
      fieldGroup: PropTypes.string,
      fields: IterableInstance
    }

    constructor(props, context) {
      super(props, context);

      /**
       * Compose the field's path on construction and store the value internally.
       * Note: That means that "fieldGroup" name cannot really be controlled.
       */
      this.fieldPath = fieldUtils.getFieldPath({
        name: this.props.name,
        fieldGroup: this.context.fieldGroup
      });
    }

    render() {
      const directProps = this.props;

      /* Get field props, either from context of from default field props (on initial render) */
      const fieldProps = fieldUtils.getFieldProps(this.fieldPath, this.context.fields, defaultFieldProps);

      const {
        focused,
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

      const value = getProperty('value', directProps, fieldProps);
      const disabled = getProperty('disabled', directProps, fieldProps);

      /* Compose the props passed to the decorated component */
      const nextProps = {
        ...directProps,
        value,

        /* Interaction states */
        focused,
        disabled, // CHECKME: doesn't work with dynamic "disabled"

        /* Validation states */
        validating,
        validatedSync,
        validSync,
        validAsync,
        validatedAsync,
        expected,
        valid,
        invalid,
        error
      };

      return React.createElement(WrappedComponent, nextProps);
    }
  }

  return FieldWrapper;
}
