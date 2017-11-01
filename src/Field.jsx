import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Field extends Component {
  static propTypes = {
    /* Specific */
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,

    /* General */
    id: PropTypes.string,
    className: PropTypes.string,

    /* States */
    disabled: PropTypes.bool
  }

  static defaultProps = {
    type: 'text'
  }

  static contextTypes = {
    handleFieldChange: PropTypes.func
  }

  handleChange = (event) => {
    const { handleFieldChange } = this.context;
    const { value: prevValue } = this.props;
    const { value: nextValue } = event.currentTarget;

    /**
     * Call parental change handler.
     */
    handleFieldChange({
      event,
      fieldProps: this.props,
      prevValue,
      nextValue
    });
  }

  render() {
    const {
      type,
      name,
      value,

      /* State */
      disabled
    } = this.props;

    return (
      <input
        {...{ type }}
        {...{ disabled }}
        value={value}
        onChange={this.handleChange} />
    );
  }
}
