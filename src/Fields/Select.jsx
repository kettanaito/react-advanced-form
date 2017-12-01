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

  /**
   * Field registration.
   * This is a Field's lifecycle method called immediately before its registration in the Form.
   * The Object this method returns is treated as field props to be registered in the Form.
   */
  fieldWillRegister() {
    return {
      ...this.props,
      initialValue: this.props.initialValue || this.props.children[0].props.value
    };
  }

  renderField(props) {
    return (
      <select>
        { props.children }
      </select>
    );
  }
}
