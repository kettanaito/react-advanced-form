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
      checked
    };
  }

  renderField() {
    return (
      <input type="checkbox" />
    );
  }
}
