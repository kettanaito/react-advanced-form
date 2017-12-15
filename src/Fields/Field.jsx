/**
 * Field (generic).
 */
import invariant from 'invariant';
import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { IterableInstance, isset, getPropsPatch, fieldUtils } from '../utils';

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
    type: PropTypes.string,
    value: PropTypes.string,

    /* Validation */
    rule: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.instanceOf(RegExp)
    ]),
    asyncRule: PropTypes.func,

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

    /* Return plain values right away */
    if (typeof propValue !== 'function') return propValue;

    /* Otherwise, try to resolve the prop value */
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
   * Maps the field to form's state to notify the latter of the new registered field.
   * By providing this mapping, and passing the "fields" Map through the context, there is no need for
   * manual parsing the children of Form for them to be controlled by the latter.
   */
  registerWith = (props) => {
    const { fields, fieldGroup } = this.context;
    const { value, initialValue } = props;
    const contextValue = fields.getIn([this.fieldPath, 'value']);

    console.groupCollapsed(this.fieldPath, '@ registerWith');
    console.log('props', Object.assign({}, this.props));
    console.log('value', value);
    console.log('initialValue', initialValue);
    console.log('context value', contextValue);

    const fieldProps = Object.assign({}, props, {
      ref: this,
      fieldPath: this.fieldPath,
      controllable: isset(value),
      value: isset(contextValue) ? contextValue : (value || initialValue || ''),
      validSync: false,
      validAsync: false,
      validatedSync: false,
      validatedAsync: false
    });

    /* Prevent { fieldGroup: undefined } for fields without a group */
    if (fieldGroup) {
      fieldProps.fieldGroup = fieldGroup;
    }

    /* Check if dynamic props are present */
    const dynamicProps = fieldUtils.getDynamicProps(props);

    /* Assign dynamic props in case they are present */
    if (dynamicProps.size > 0) {
      fieldProps.dynamicProps = dynamicProps;
    }

    console.log('dynamicProps', dynamicProps);
    console.log('register with:', Object.assign({}, fieldProps));
    console.groupEnd();

    /**
     * Notify the parent Form that a new field has just mounted.
     * Timeout makes this action async, hence each registration attempt may access the actual state of the form.
     * Otherwise, registrations happen at approximately same time, resulting into fields being unaware of each other.
     */
    setTimeout(() => {
      return this.context.registerField(Map(fieldProps));
    }, 0);
  }

  /**
   * Field will register.
   * A field's lifecycle method which, when specified, is expected to return an Object to be treated as props
   * upon field's registration within the form. You don't need to specify it explicitly unless you want for a field
   * to be registered with some altered props, rather than its own (i.e. Radio input needs to have a "checked" prop).
   */
  fieldWillRegister() {
    return this.props;
  }

  /**
   * Field will unregister.
   * Called immediately before unmounting the node of the field.
   */
  fieldWillUnregister() {
    return null;
  }

  componentWillMount() {
    const fieldProps = this.fieldWillRegister();

    /* Notify the parent Form that a new field is about to mount */
    return this.registerWith(fieldProps);
  }

  componentWillReceiveProps(nextProps) {
    const { contextProps } = this;
    if (!contextProps) return;

    /**
     * Handle controlled fields.
     * The responsibility of value update of controlled fields is delegated to the end developer.
     * However, that still means that the new value should be propagated to theF orm's state to guarantee
     * proper value in the form lifecycle methods.
     */
    const controllable = contextProps.get('controllable');

    if (controllable && (nextProps.value !== this.props.value)) {
      this.context.handleFieldChange({
        nextValue: nextProps.value,
        prevValue: this.props.value,
        fieldProps: contextProps
      });
    }

    /**
     * Handle direct props updates.
     * When direct props receive new values, those should be updated in the Form's state as well.
     */
    const propsPatch = getPropsPatch({
      contextProps,
      nextProps
    });

    if (Object.keys(propsPatch).length > 0) {
      this.context.updateField({
        fieldPath: this.fieldPath,
        propsPatch
      });
    }
  }

  /**
   * Predicates whether the field should update.
   * Updates should be preceeded by the context change since the latter serves as a single source of truth
   * for the field's props.
   */
  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   /* Bypass the state when the field is not yet registered */
  //   if (!this.contextProps) return true;

  //   /* Get the next context props of the field */
  //   const nextContextProps = nextContext.fields.getIn([this.fieldPath]);

  //   /* Compare next context props with the current context props */
  //   return (
  //     !this.contextProps.equals(nextContextProps) ||
  //     JSON.stringify(this.props) !== JSON.stringify(nextProps)
  //   );
  // }

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
    console.warn('handleChange @ Field', this.fieldPath);

    const { value: nextValue } = event.currentTarget;
    const { contextProps } = this;
    const prevValue = contextProps.get('value');
    const hasUpdateMethod = contextProps.get('controllable') ? this.props.onChange : true;

    console.groupCollapsed(this.fieldPath, '@ Field @ handleChange');
    console.log('contextProps', contextProps);
    console.log('prevValue', prevValue);
    console.log('nextValue', nextValue);
    console.log('hasUpdateMethod', hasUpdateMethod);
    console.log('this.context.handleFieldChange', this.context.handleFieldChange);
    console.groupEnd();

    invariant(hasUpdateMethod, `Cannot update the controlled field \`${contextProps.get('name')}\`. Expected custom \`onChange\` handler, but received: ${this.props.onChange}.`);

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

  /**
   * Renders the element.
   * Extend this method on the particular field component to render different React component
   * upon Field's render. By default render nothing.
   */
  renderElement() {
    return null;
  }

  render() {
    /**
     * Skip rendering unless the field in in the Form's context.
     * While this is a safe method to ensure the relevant component's props are being rendered,
     * it results into a noticeable flash of unrendered component.
     *
     * See more: https://github.com/kettanaito/react-advanced-form/issues/77.
     */
    if (!this.contextProps) return null;

    const { id, className, style } = this.props;

    const Component = this.renderElement(this.props, this.contextProps);
    invariant(Component, `Cannot render the field \`${this.props.name}\`, no valid React element was returns from its "renderElement()" method.`);

    return (
      <Component.type
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
