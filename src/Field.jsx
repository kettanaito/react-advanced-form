import { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Field extends Component {
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

  static contextTypes = {
    fields: PropTypes.instanceOf(Map),
    mapFieldToState: PropTypes.func,
    handleFieldBlur: PropTypes.func,
    handleFieldChange: PropTypes.func
  }

  componentDidMount() {
    const { fields } = this.context;

    /**
     * Map the field to Form's state to notify the latter of the new registered field.
     * Timeout is required because {componentDidMount} happens at the same time for all
     * fields inside the composite component. Thus, each field is updating the state
     * based on its value upon the composite mount. This causes issues of missing fields.
     */
    setTimeout(() => {
      this.context.mapFieldToState(this.props, this.context.fields);
    }, 0);
  }

  handleBlur = (event) => {
    this.context.handleFieldBlur({
      event,
      fieldProps: this.props
    });
  }

  handleChange = (event) => {
    const { value: prevValue } = this.props;
    const { value: nextValue } = event.currentTarget;

    /* Call parental change handler */
    this.context.handleFieldChange({
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
