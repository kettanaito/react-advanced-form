import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { isset, fieldUtils } from '../utils';

export const defaultProps = {
  type: 'text',
  expected: true,
  value: '',
  required: false,
  disabled: false
};

export default class Field extends React.Component {
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
    validated: PropTypes.bool, // whether the field has been validated previously
    // valid: PropTypes.bool, // whether the field is valid
    rule: PropTypes.instanceOf(RegExp), // sync validation rule
    asyncRule: PropTypes.func, // async validation rule (function to return a Promise)

    /* States */
    required: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    disabled: PropTypes.oneOfType([PropTypes.func, PropTypes.bool])
  }

  static defaultProps = defaultProps

  static contextTypes = {
    fieldGroup: PropTypes.string,
    fields: PropTypes.instanceOf(Map).isRequired,
    mapFieldToState: PropTypes.func.isRequired,
    handleFieldFocus: PropTypes.func.isRequired,
    handleFieldBlur: PropTypes.func.isRequired,
    handleFieldChange: PropTypes.func.isRequired
  }

  /**
   * Get prop.
   * Gets the given prop name from the context first, otherwise tries to resolve the prop.
   * In case both return undefined, fallbacks to the default prop value.
   */
  getProp(propName) {
    const { fields } = this.context;

    const contextValue = fields.getIn([...this.fieldPath, propName]);
    const propValue = isset(contextValue) ? contextValue : this.props[propName];

    if (typeof propValue !== 'function') return propValue;

    const fieldProps = fieldUtils.getFieldProps(this.fieldPath, fields, this.props);
    const resolvedPropValue = fieldUtils.resolveProp({ propName, fieldProps, fields });
    return resolvedPropValue || defaultProps[propName];
  }

  constructor(props, context) {
    super(props, context);
    const { fieldGroup } = context;

    /* Compose field's path in the state (in case of being under fieldGroup) */
    this.fieldPath = fieldUtils.getFieldPath({
      ...props,
      fieldGroup
    });
  }

  componentDidMount() {
    // console.warn('Field @ mount');
    /**
     * Map the field to Form's state to notify the latter of the new registered field.
     * Timeout is required because {componentDidMount} happens at the same time for all
     * fields inside the composite component. Thus, each field is updating the state
     * based on its value upon the composite mount. This causes issues of missing fields.
     */
    setTimeout(() => {
      const fieldProps = {
        ...this.props,
        fieldGroup: this.context.fieldGroup,
        fieldPath: this.fieldPath,
        validated: false
      };

      this.context.mapFieldToState({ fieldProps });
    }, 0);
  }

  /**
   * Handles field focus.
   * Bubbles up to the Form to mutate the state of this particular field,
   * setting its "focus" property to the respective value.
   */
  handleFocus = (event) => {
    const fieldProps = fieldUtils.getFieldProps(this.fieldPath, this.context.fields, this.props);

    return this.context.handleFieldFocus({
      event,
      fieldProps
    });
  }

  /**
   * Handles field's value change.
   */
  handleChange = (event) => {
    const { value: prevValue } = this.props;
    const { value: nextValue } = event.currentTarget;

    const fieldProps = fieldUtils.getFieldProps(this.fieldPath, this.context.fields, this.props);

    /* Call parental change handler */
    this.context.handleFieldChange({
      event,
      fieldProps,
      nextValue,
      prevValue
    });
  }

  /**
   * Handles field blur.
   */
  handleBlur = (event) => {
    const { value } = event.currentTarget;

    const fieldProps = fieldUtils.getFieldProps(this.fieldPath, this.context.fields, this.props);
    fieldProps.value = value;

    return this.context.handleFieldBlur({ event, fieldProps });
  }

  render() {
    const { name, type, id, className, style } = this.props;

    return (
      <input
        name={ name }
        type={ type }
        id={ id }
        className={ className }
        style={ style }
        value={ this.getProp('value') }
        required={ this.getProp('required') }
        disabled={ this.getProp('disabled') }
        onFocus={ this.handleFocus }
        onChange={ this.handleChange }
        onBlur={ this.handleBlur } />
    );
  }
}
