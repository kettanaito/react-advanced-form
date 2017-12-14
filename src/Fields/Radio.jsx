/**
 * Radio.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Field from './Field';

export default class Radio extends Field {
  static displayName = 'Field.Radio'

  static propTypes = {
    /* General */
    id: PropTypes.string,
    className: PropTypes.string,

    /* Specific */
    name: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    required: PropTypes.bool,

    /* Event handlers */
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func
  }

  static defaultProps = {
    type: 'radio',
    expected: true,
    required: false,
    disabled: false,
    checked: false
  }

  /**
   * Field registration.
   * Radio inputs are unique in terms how their context props are handled.
   * 1. Never pass "props.value" to context. <Field.Radio> is always expected to receive a "value" prop,
   * however it should never set it to context on registration. The value in the context will be changed
   * according to the onChange handlers in the future.
   * 2. Determine "initialValue" based on optional "checked" prop.
   * 3. Add new "checked" props unique to this field type.
   */
  fieldWillRegister() {
    const { checked, value } = this.props;

    console.groupCollapsed(this.fieldPath, '@ fieldWillRegister');
    console.log('props', Object.assign({}, this.props));

    const fieldProps = {
      ...this.props,
      value: checked ? value : null // other radio inputs are not mutating the conext value
    };

    if (checked) {
      fieldProps.checked = checked;

      if (value) {
        /* Only checked radio will set the context value to its value */
        fieldProps.initialValue = value;
      }
    }

    console.log('fieldProps:', fieldProps);
    console.groupEnd();

    return fieldProps;
  }

  renderElement(props, contextProps) {
    return (
      <input
        type="radio"
        value={ props.value }
        checked={ props.value === contextProps.get('value') } />
    );
  }
}
