import React from 'react';
import PropTypes from 'prop-types';
import Field from './Field';

export default class Checkbox extends Field {
  static displayName = 'Field.Checkbox'

  static propTypes = {
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool
  }

  static defaultProps = {
    checked: false
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

  renderField() {
    return (
      <input />
    );
  }
}
