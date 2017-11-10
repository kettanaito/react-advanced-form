import { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Field extends Component {
  static contextTypes = {
    fields: PropTypes.instanceOf(Map),
    registerInput: PropTypes.func,
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

  componentDidMount() {
    const { fields } = this.context;
    const { name } = this.props;

    if (fields.get(name)) return;

    setTimeout(() => {
      this.context.registerInput(this.props, this.context.fields);
    }, 0);
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
    const { type, name } = this.props;
    const fieldProps = this.context.fields.get(name) || Map();

    return (
      <input
        {...{ type }}
        disabled={ fieldProps.get('disabled') }
        required={ fieldProps.get('required') }
        value={ fieldProps.get('value') || '' }
        onBlur={ this.handleBlur }
        onChange={ this.handleChange } />
    );
  }
}
