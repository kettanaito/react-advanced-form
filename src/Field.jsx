import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Field extends Component {
  static propTypes = {
    /* Specific */
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,

    /* Validation */
    required: PropTypes.bool,
    rule: PropTypes.instanceOf(RegExp),
    valid: PropTypes.bool.isRequired,

    /* General */
    id: PropTypes.string,
    className: PropTypes.string,

    /* States */
    disabled: PropTypes.bool
  }

  static defaultProps = {
    type: 'text',
    required: false,
    valid: true
  }

  static contextTypes = {
    handleFieldBlur: PropTypes.func,
    handleFieldChange: PropTypes.func
  }

  handleBlur = (event) => {
    const { handleFieldBlur } = this.context;

    handleFieldBlur({
      event,
      fieldProps: this.props
    });
  }

  handleChange = (event) => {
    const { handleFieldChange } = this.context;
    const { value: prevValue } = this.props;
    const { value: nextValue } = event.currentTarget;

    /* Call parental change handler */
    handleFieldChange({
      event,
      fieldProps: this.props,
      nextValue,
      prevValue
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
        onBlur={this.handleBlur}
        onChange={this.handleChange} />
    );
  }
}
