/**
 * Context decorator.
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

export default function withContext(WrappedComponent) {
  class ContextWrapper extends React.Component {
    static displayName = `withContext(${getComponentName(WrappedComponent)})`;

    static contextTypes = {
      fields: PropTypes.instanceOf(Map).isRequired
    }

    render() {
      const { fields } = this.context;
      const { name } = this.props;

      const fieldProps = fields.has(name) ? fields.get(name).toJS() : defaultProps;
      const props = Object.assign({}, this.props, { fieldProps });

      return React.createElement(WrappedComponent, props);
    }
  }

  return ContextWrapper;
}
