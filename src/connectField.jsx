/**
 * Connect field.
 * A HOC which enhances a custom field with the wrapped native field's props.
 */
import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import defaultFieldProps from './const/default-field-props';
import { getComponentName, getProperty, IterableInstance, fieldUtils } from './utils';

export default function connectField(WrappedComponent) {
  class FieldConnector extends React.Component {
    static displayName = `connectField(${getComponentName(WrappedComponent)})`;

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
      const { props: directProps, context, fieldPath } = this;

      /* Get field props, either from context of from default field props (on initial render) */
      const fieldProps = fieldUtils.getFieldProps(fieldPath, context.fields, defaultFieldProps);

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
      // const value = getProperty('value', directProps, fieldProps);
      
      const disabled = getProperty('disabled', directProps, fieldProps);

      /* Compose the props passed to the enhanced component */
      const nextProps = {
        ...directProps,
        // value, // doesn't work properly with controlled value

        /* States */
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

  return hoistNonReactStatics(FieldConnector, WrappedComponent);
}
