/**
 * Field (generic).
 */
import invariant from 'invariant';
import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { IterableInstance, isset, fieldUtils } from '../utils';

export const defaultProps = {
  expected: true,
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
    rule: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.instanceOf(RegExp)
    ]), // sync validation rule
    asyncRule: PropTypes.func, // async validation rule (function to return a Promise)

    /* States */
    required: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    disabled: PropTypes.oneOfType([PropTypes.func, PropTypes.bool])
  }

  static defaultProps = defaultProps

  static contextTypes = {
    fieldGroup: PropTypes.string,
    fields: IterableInstance,
    registerField: PropTypes.func.isRequired,
    updateField: PropTypes.func.isRequired,
    unregisterField: PropTypes.func.isRequired,
    handleFieldFocus: PropTypes.func.isRequired,
    handleFieldBlur: PropTypes.func.isRequired,
    handleFieldChange: PropTypes.func.isRequired
  }

  /**
   * Gets the given prop name from the context first, otherwise tries to resolve the prop.
   * In case both return undefined, fallbacks to the default prop value.
   */
  getProp(propName) {
    const { fields } = this.context;

    const contextValue = fields.getIn([this.fieldPath, propName]);
    const propValue = isset(contextValue) ? contextValue : this.props[propName];

    if (typeof propValue !== 'function') return propValue;

    const resolvedPropValue = fieldUtils.resolveProp({ propName, fieldProps: this.contextProps, fields });
    return resolvedPropValue || defaultProps[propName];
  }

  constructor(props, context) {
    super(props, context);

    const { fieldGroup } = this.context;

    /* Compose field's path in the state (in case of being under fieldGroup) */
    this.fieldPath = fieldUtils.getFieldPath({ ...this.props, fieldGroup });
  }

  /**
   * Map the field to Form's state to notify the latter of the new registered field.
   * Timeout is required because {componentDidMount} happens at the same time for all
   * fields inside the composite component. Thus, each field is updating the state
   * based on its value upon the composite mount. This causes issues of missing fields.
   */
  registerWith = (props) => {
    const { fieldGroup } = this.context;
    const { value, initialValue } = props;

    const fieldProps = Object.assign({}, props, {
      fieldPath: this.fieldPath,
      controllable: isset(value),
      dynamicProps: fieldUtils.getDynamicProps(props),
      value: value || initialValue || '',
      validSync: false,
      validAsync: false,
      validatedSync: false,
      validatedAsync: false
    });

    /* Prevent { fieldGroup: undefined } for fields without a group */
    if (fieldGroup) {
      fieldProps.fieldGroup = fieldGroup;
    }

    /* Notify the parent Form that a new field has just mounted */
    return this.context.registerField(fromJS(fieldProps));
  }

  updateWith({ propsPatch }) {
    return this.context.updateField({
      fieldProps: this.contextProps,
      propsPatch
    });
  }

  fieldWillRegister() {
    return this.props;
  }

  fieldWillUnregister() {
    return null;
  }

  componentWillMount() {
    const fieldProps = this.fieldWillRegister();

    /* Notify the parent Form that a new field is about to mount */
    return this.registerWith(fieldProps);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.contextProps) return;
    const controllable = this.contextProps.get('controllable');

    if (controllable && (nextProps.value !== this.props.value)) {
      this.context.handleFieldChange({ nextValue: nextProps.value, prevValue: this.props.value, fieldProps: this.contextProps });
    }
  }

  /**
   * Ensures "this.contextProps" are updated after the component's update.
   */
  componentWillUpdate(nextProps, nextState, nextContext) {
    this.contextProps = nextContext.fields.getIn([this.fieldPath]);
  }

  /**
   * Deletes the field's bindings from the Form on unmounting.
   */
  componentWillUnmount() {
    this.fieldWillUnregister();
    return this.context.unregisterField(this.contextProps);
  }

  /**
   * Handles field focus.
   * Bubbles up to the Form to mutate the state of this particular field,
   * setting its "focus" property to the respective value.
   */
  handleFocus = (event) => {
    return this.context.handleFieldFocus({
      event,
      fieldProps: this.contextProps
    });
  }

  /**
   * Handles field's value change.
   */
  handleChange = (event) => {
    const { value: nextValue } = event.currentTarget;
    const { contextProps } = this;
    const prevValue = contextProps.get('value');
    const hasUpdateMethod = contextProps.get('controllable') ? this.props.onChange : true;

    invariant(hasUpdateMethod, `Cannot update the controlled field "${contextProps.get('name')}". Expected custom "onChange" handler, but received: ${this.props.onChange}.`);

    /* Call parental change handler */
    return this.context.handleFieldChange({
      event,
      fieldProps: contextProps,
      nextValue,
      prevValue
    });
  }

  /**
   * Handles field blur.
   */
  handleBlur = (event) => {
    return this.context.handleFieldBlur({
      event,
      fieldProps: this.contextProps
    });
  }

  renderField() {
    return null;
  }

  render() {
    /* Skip rendering unless the field in in the Form's context */
    if (!this.contextProps) return null;

    const { id, className, style } = this.props;

    const Component = this.renderField(this.props, this.contextProps);
    invariant(Component, `Cannot render the field \`${this.props.name}\` as it doesn't have a renderable component. Make sure to return a React component in "renderField()" method.`);

    return (
      <Component.type
        ref={ this.getReference }
        name={ this.contextProps.get('name') }
        type={ this.contextProps.get('type') }
        id={ id }
        className={ className }
        style={ style }
        value={ this.contextProps.get('controllable') ? this.props.value : this.contextProps.get('value') }
        required={ this.contextProps.get('required') }
        disabled={ this.contextProps.get('disabled') }
        onFocus={ this.handleFocus }
        onChange={ this.handleChange }
        onBlur={ this.handleBlur }
        {...Component.props}>
        { Component.props.children }
      </Component.type>
    );
  }
}
