import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Field extends Component {
  static contextTypes = {
    handleFieldBlur: PropTypes.func,
    handleFieldChange: PropTypes.func
  }

  static propTypes = {
    /* General */
    id: PropTypes.string,
    className: PropTypes.string,

    /* Specific */
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,

    /* Validation */
    rule: PropTypes.instanceOf(RegExp),
    asyncRule: PropTypes.func,
    valid: PropTypes.bool.isRequired,

    /* States */
    required: PropTypes.bool,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    type: 'text',
    required: false,
    disabled: false,
    valid: true
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
      required,
      disabled
    } = this.props;

    return (
      <input
        {...{ type }}
        {...{ disabled }}
        {...{ required }}
        value={value}
        onBlur={this.handleBlur}
        onChange={this.handleChange} />
    );
  }
}
