/**
 * Input.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Field from './Field';

export default class Input extends Field {
  static displayName = 'Field.Input'

  static propTypes = {
    /* Specific */
    placeholder: PropTypes.string
  }

  static defaultProps = {
    type: 'text',
    expected: true,
    required: false,
    disabled: false
  }

  renderElement() {
    return (
      <input />
    );
  }
}
