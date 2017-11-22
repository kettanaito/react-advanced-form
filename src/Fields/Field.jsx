import { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import keywords from '../keywords';
import { isset } from '../utils';

export default class Field extends Component {
  static propTypes = {
    /* General */
    id: PropTypes.string,
    className: PropTypes.string,

    /* Specific */
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
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
    valid: keywords.none,
    required: false,
    disabled: false
  }

  static contextTypes = {
    fields: PropTypes.instanceOf(Map),
    mapFieldToState: PropTypes.func.isRequired,
    handleFieldFocus: PropTypes.func.isRequired,
    handleFieldBlur: PropTypes.func.isRequired,
    handleFieldChange: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { fields } = this.context;

    // console.log('| | Field @ componentDidMount. Need to map field to state');

    /**
     * Map the field to Form's state to notify the latter of the new registered field.
     * Timeout is required because {componentDidMount} happens at the same time for all
     * fields inside the composite component. Thus, each field is updating the state
     * based on its value upon the composite mount. This causes issues of missing fields.
     */
    setTimeout(() => {
      this.context.mapFieldToState({
        fieldProps: this.props,
        // this.context.fields,
        fieldComponent: this
      });
    }, 0);
  }

  handleChange = (event) => {
    const { value: prevValue } = this.props;
    const { value: nextValue } = event.currentTarget;

    // console.log(' ');
    // console.log('| | Field @ handleChange', this.props.name, nextValue);

    /* Call parental change handler */
    this.context.handleFieldChange({
      event,
      fieldProps: this.props,
      nextValue,
      prevValue
    });
  }

  /**
   * Handle field focus.
   * Bubble up to the Form to mutate the state of this particular field,
   * setting its "focus" property to the respective value.
   */
  handleFocus = (event) => {
    this.context.handleFieldFocus({
      event,
      fieldProps: this.props
    });
  }

  /**
   * Handle field blur.
   */
  handleBlur = (event) => {
    const { value } = event.currentTarget;
    const fieldProps = Object.assign({}, this.props, { value });

    this.context.handleFieldBlur({ event, fieldProps });
  }

  render() {
    /* Props passed to <Field /> on the client usage */
    const { name, rule, asyncRule, valid, ...directProps } = this.props;

    /* Get the Map of all fields from the Form's context */
    const { fields } = this.context;

    /* Get the current Field's props */
    const fieldContext = fields.get(name) || Map();

    /* Handle composite props (with fallbacks) */
    const validInContext = fieldContext.get('valid');

    /**
     * Input props.
     * Props passed directly to the Field's element. Do not add
     * properties which are not natively supported by that element.
     */
    const inputProps = {
      value: fieldContext.get('value') || '',
      required: fieldContext.get('required'),
      disabled: fieldContext.get('disabled'),
    };

    /**
     * Context props.
     * Props which describe the Field but are not assigned to
     * the Field's element directly. Useful for HOC styling.
     */
    const contextProps = {
      valid: isset(validInContext) ? validInContext : true,
      focused: fieldContext.get('focused') || false
    };

    /**
     * Event handlers assigned to the Field's element directly.
     * Those handle changes which mutate the internal state/context.
     */
    const eventHandlers = {
      onChange: this.handleChange,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur
    };

    return (
      <input {...directProps} {...inputProps} {...eventHandlers} />
    );
  }
}
