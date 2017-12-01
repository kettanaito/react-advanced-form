/**
 * Select.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Field from './Field';

export default class Select extends Field {
  static displayName = 'Field.Select'

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.string
  }

  fieldWillRegister = () => ({
    ...this.props,
    initialValue: this.props.initialValue || this.props.children[0].props.value
  })

  renderField({ children }) {
    return (
      <select>
        { children }
      </select>
    );
  }
}
