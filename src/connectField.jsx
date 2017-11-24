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
      fields: PropTypes.instanceOf(Map).isRequired
    }

    render() {
      const { fields } = this.context;
      const { name } = this.props;

      const fieldProps = fields.has(name) ? fields.get(name).toJS() : defaultProps;
      const { focused, disabled, expected, valid, invalid } = fieldProps;

      /* Grab the value from context props when available, to present actual data in the components tree */
      const value = fields.has(name) ? fields.getIn([name, 'value']) : this.props.value;

      const props = {
        ...this.props,
        fieldProps: { focused, disabled, expected, valid, invalid },
        value
      };

      return React.createElement(WrappedComponent, props);
    }
  }

  return CustomFieldWrapper;
}
