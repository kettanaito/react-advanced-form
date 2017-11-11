import { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isset } from './utils';

export default class Field extends Component {
  static propTypes = {
    /* General */
    id: PropTypes.string,
    className: PropTypes.string,

    /* Specific */
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,

    /* Validation */
    rule: PropTypes.instanceOf(RegExp),
    asyncRule: PropTypes.func,

    /* States */
    required: PropTypes.bool,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    type: 'text',
    required: false,
    disabled: false
  }

  static contextTypes = {
    fields: PropTypes.instanceOf(Map),
    templates: PropTypes.object.isRequired,
    mapFieldToState: PropTypes.func.isRequired,
    handleFieldBlur: PropTypes.func.isRequired,
    handleFieldChange: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { fields } = this.context;

    console.log('| | Field @ componentDidMount. Need to map field to state');

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

  handleChange = (event) => {
    const { value: prevValue } = this.props;
    const { value: nextValue } = event.currentTarget;

    console.log(' ');
    console.log('| | Field @ handleChange', this.props.name, nextValue);

    /* Call parental change handler */
    this.context.handleFieldChange({
      event,
      fieldProps: this.props,
      nextValue,
      prevValue
    });
  }

  handleBlur = (event) => {
    const { value } = event.currentTarget;
    console.log('| | Field @ handleBlur', this.props.name, value);

    const fieldProps = Object.assign({}, this.props, { value });

    this.context.handleFieldBlur({
      event,
      fieldProps
    });
  }

  render() {
    const { fields, templates } = this.context;
    const { name, type, placeholder } = this.props;

    const fieldProps = fields.get(name) || Map();
    const FieldTemplate = templates.Input;

    const fieldValue = fieldProps.get('value') || '';
    const validInContext = fieldProps.get('valid');
    const fieldValid = isset(validInContext) ? validInContext : true;

    const fieldProps2 = {
      type,
      name,
      placeholder,

      /* Validation */
      value: fieldValue,
      valid: fieldValid,

      /* State */
      disabled: fieldProps.get('disabled'),
      required: fieldProps.get('required'),

      /* Event handlers */
      onChange: this.handleChange,
      onBlur: this.handleBlur,
    };

    return (
      <FieldTemplate fieldProps={ fieldProps2 } />
    );
  }
}
