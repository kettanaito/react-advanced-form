import React from 'react';
import PropTypes from 'prop-types';
import Field from './Field';

export default class Checkbox extends Field {
  static displayName = 'Field.Checkbox'

  static propTypes = {
    /* General */
    id: PropTypes.string,
    className: PropTypes.string,

    /* Specific */
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    required: PropTypes.bool,

    /* Event handlers */
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func
  }

  static defaultProps = {
    expected: true,
    checked: false,
    disabled: false,
    required: false
  }

  fieldWillRegister() {
    const { checked } = this.props;

    return {
      ...this.props,
      type: 'checkbox',
      checked
    };
  }

  handleChange = (event) => {
    const { contextProps } = this;
    const { checked: nextValue } = event.currentTarget;
    const prevValue = contextProps.get('checked');

    return this.context.handleFieldChange({
      event,
      fieldProps: contextProps,
      valueProp: 'checked',
      prevValue,
      nextValue
    });
  }

  renderElement(props, contextProps) {
    return (
      <input checked={ contextProps.get('checked') } />
    );
  }
}
