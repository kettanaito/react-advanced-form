/**
 * Select.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Field from './Field';

export default class Select extends Field {
  static displayName = 'Field.Select'

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.string,
  }

  getReference = (node) => {
    const { value: nativeValue } = node;
    if (this.props.value || !nativeValue) return;

    this.updateWith({
      propsPatch: {
        value: nativeValue
      }
    });
  }

  renderField({ children }) {
    return (
      <select>
        { children }
      </select>
    );
  }
}
