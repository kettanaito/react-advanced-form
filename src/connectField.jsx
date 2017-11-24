/**
 * Connect field.
 * A decorator for custom components for styling over default Field.
 * This decorator will allow to access the field's props from the Form's context
 * from within the custom styling components without having them to subscribe to
 * the context types.
 */
import { Map } from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import { defaultProps } from './Fields/Field';

function getComponentName(component) {
  return component.displayName || component.name || 'Component';
}

export default function connectField(WrappedComponent) {
  class CustomFieldWrapper extends React.Component {
    static displayName = `ConnectedField(${getComponentName(WrappedComponent)})`;

    static contextTypes = {
      fieldGroup: PropTypes.string,
      fields: PropTypes.instanceOf(Map).isRequired
    }

    render() {
      const { fields, fieldGroup } = this.context;
      const directProps = this.props;
      const { name } = directProps;

      const fieldPath = [name];
      if (fieldGroup) fieldPath.unshift(fieldGroup);

      const fieldProps = fields.hasIn(fieldPath) ? fields.getIn(fieldPath).toJS() : defaultProps;

      const { focused, disabled, expected, valid, invalid } = fieldProps;

      /* Grab the value from context props when available, to present actual data in the components tree */
      const value = fields.hasIn(fieldPath) ? fields.getIn([...fieldPath, 'value']) : directProps.value;

      const props = {
        ...directProps,
        focused,
        disabled,
        expected,
        valid,
        invalid,
        value
      };

      return React.createElement(WrappedComponent, props);
    }
  }

  return CustomFieldWrapper;
}
