/**
 * A high-order component which provides the reference of the field's record to the wrapped custom
 * component. May be used for custom field styling, implementing fields with custom logic or
 * third-party field components integration.
 */
import { EventEmitter } from 'events';
import { Map } from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { isset, camelize, CustomPropTypes, getComponentName, rxUtils } from '../utils';

/* Default options for `connectField()` HOC */
const defaultOptions = {
  valuePropName: 'value',
  mapPropsToField: ({ fieldRecord }) => fieldRecord,
  shouldValidateOnMount: ({ fieldRecord, valuePropName }) => {
    const fieldValue = fieldRecord[valuePropName];
    return isset(fieldValue) && (fieldValue !== '');
  },
  shouldUpdateRecord: ({ prevValue, nextValue }) => (prevValue !== nextValue),
  enforceProps: () => ({})
};

/**
 * When any of those props are passed to the end instance of the custom field, they are mapped to the
 * field record and called during the field's lifecycle methods in the Form.
 */
const inheritedProps = ['rule', 'asyncRule', 'onFocus', 'onChange', 'onBlur'];

export default function connectField(options) {
  const hocOptions = { ...defaultOptions, ...options };
  const { valuePropName } = hocOptions;

  return function (WrappedComponent) {
    class Field extends React.Component {
      static displayName = `Field.${getComponentName(WrappedComponent)}`

      static propTypes = {
        skip: PropTypes.bool
      }

      static defaultProps = {
        type: 'text',
        disabled: false,
        required: false,
        skip: false
      }

      static contextTypes = {
        fields: CustomPropTypes.Map.isRequired,
        fieldGroup: PropTypes.string,
        eventEmitter: PropTypes.instanceOf(EventEmitter)
      }

      constructor(props, context) {
        super(props, context);
        const { name, fieldGroup } = props;

        /* Compose the proper field path */
        this.fieldPath = fieldGroup ? [fieldGroup, name] : [name];

        /**
         * Register the field in the parent Form's state and store its internal record reference (contextProps).
         * Also, assume the field's contextProps, since they are composed at this moment. There is no need
         * to wait for the next re-rendering to access them.
         */
        this.contextProps = this.register();
      }

      /* Registers the current field within the parent form's state */
      register() {
        const { fieldPath } = this;
        const { eventEmitter, fields, fieldGroup } = this.context;
        const { value, initialValue } = this.props;

        const contextValue = fields.getIn([...fieldPath, valuePropName]);

        console.groupCollapsed(fieldPath, '@ register');
        console.log('this.props:', Object.assign({}, this.props));
        console.log('value:', value);
        console.log('initial value:', initialValue);
        console.log('context value:', contextValue);

        /* Get the proper field value to register with */
        const registeredValue = isset(contextValue) ? contextValue : (value || initialValue || '');

        const defaultFieldRecord = {
          /* Internals */
          ref: this,
          fieldPath,

          /* General */
          name: this.props.name,
          type: this.props.type,
          valuePropName,
          [valuePropName]: registeredValue,
          initialValue: this.props.hasOwnProperty('initialValue') ? initialValue : registeredValue,

          /* States */
          controlled: this.props.hasOwnProperty('value'),
          focused: false,

          /* Validation */
          errors: null,
          required: this.props.required,
          expected: true,
          skip: this.props.skip,
          valid: false,
          invalid: false,
          validating: false,
          validatedSync: false,
          validSync: false,
          validatedAsync: false,
          validAsync: false
        };

        /* Inherit expected props to the field record */
        inheritedProps.forEach((propName) => {
          const propValue = this.props[propName];
          if (propValue) defaultFieldRecord[propName] = propValue;
        });

        console.log('defaultFieldRecord:', Object.assign({}, defaultFieldRecord));

        /* (Optional) Alter the field record using HOC options */
        const fieldRecord = hocOptions.mapPropsToField({
          fieldRecord: defaultFieldRecord,
          props: this.props,
          context: this.context,
          valuePropName
        });

        fieldRecord.shouldValidateOnMount = hocOptions.shouldValidateOnMount({
          fieldRecord,
          props: this.props,
          context: this.context,
          valuePropName
        });

        console.log('fieldRecord:', fieldRecord);

        /* Prevent { fieldGroup: undefined } for the fields without a group */
        if (fieldGroup) {
          fieldRecord.fieldGroup = fieldGroup;
        }

        /* Create immutable field props from the mutable field record */
        let fieldProps = Map(fieldRecord);

        /* Get the list of reactive props of the current field */
        const rxProps = rxUtils.getRxProps(fieldProps);
        if (rxProps.size > 0) {
          fieldProps = fieldProps.set('reactiveProps', rxProps);

          // TODO Use "deleteAll" once Immutable 4.0 lands
          rxProps.forEach((_, rxPropName) => {
            fieldProps = fieldProps.delete(rxPropName);
          });
        }

        console.log('rxProps:', rxProps && rxProps.toJS());
        console.log('register with:', Object.assign({}, fieldRecord));
        console.log('fieldProps:', fieldProps && fieldProps.toJS());
        console.groupEnd();

        /* Notify the parent Form that a new field prompts to register */
        eventEmitter.emit('fieldRegister', fieldProps);

        return fieldProps;
      }

      componentWillReceiveProps(nextProps) {
        const { contextProps } = this;
        if (!contextProps) return;

        /**
         * Handle value change of controlled fields.
         * The responsibility of value update of controlled fields is delegated to the end developer.
         * However, that still means that the new value should be propagated to the Form's state to guarantee
         * the field's internal record is updated respectively.
         */
        const controlled = contextProps.get('controlled');
        const nextValue = nextProps[valuePropName];
        const prevValue = this.props[valuePropName];

        const shouldUpdateRecord = hocOptions.shouldUpdateRecord({
          nextValue,
          prevValue,
          prevProps: this.props,
          nextProps,
          contextProps
        });

        if (controlled && shouldUpdateRecord) {
          this.context.eventEmitter.emit('fieldChange', {
            event: {
              nativeEvent: {
                isForcedUpdate: true
              }
            },
            nextValue,
            prevValue,
            fieldProps: contextProps
          });
        }
      }

      /**
       * Ensure "this.contextProps" reference is updated according to the context updates.
       */
      componentWillUpdate(nextProps, nextState, nextContext) {
        /* Bypass scenarios when field is being updated, but not yet registred within the Form */
        const nextContextProps = nextContext.fields.getIn(this.fieldPath);
        if (!nextContextProps) return;

        /* Update the internal reference to contextProps */
        const { props: prevProps, contextProps: prevContextProps } = this;
        this.contextProps = nextContextProps;

        const fieldPropsChange = camelize(...this.contextProps.get('fieldPath'), 'props', 'change');

        this.context.eventEmitter.emit(fieldPropsChange, {
          nextProps,
          prevProps,
          prevContextProps,
          nextContextProps
        });
      }

      /**
       * Deletes the field's record upon unmounting.
       */
      componentWillUnmount() {
        this.context.eventEmitter.emit('fieldUnregister', this.contextProps);
      }

      /**
       * Handle field and inner field component refenreces.
       * @param {ReactComponent} Component
       */
      getInnerRef = (Component) => {
        /**
         * Store inner component reference internally.
         * This way inner reference is accessible by custom field reference like
         * "CustomField.ref(Field).innerRef(Component)".
         */
        this.innerRef = Component;

        /**
         * Allow direct reference to inner component.
         * <CustomField innerRef={ ... } />
         *
         * First, check if the component where "fieldProps" are destructued is another
         * React Component. This means, that the end developer wrapped the "input" with
         * another React Component. In that case "innerRef" will not return the actual
         * "input", but custom React Component, which would be the same what "innerRef"
         * references. In that case, omit explicit call of "innerRef".
         */
        if (Component instanceof React.Component) return;

        const { innerRef } = this.props;
        if (innerRef) innerRef(Component);
      }

      /**
       * Handles field focus.
       * @param {Event} event
       */
      handleFocus = (event) => {
        this.context.eventEmitter.emit('fieldFocus', {
          event,
          fieldProps: this.contextProps
        });
      }

      /**
       * Handles field change.
       * @param {Event} event
       * @param {any} nextValue
       * @param {any} prevValue
       */
      handleChange = ({ event, nextValue: customNextValue, prevValue: customPrevValue }) => {
        const { contextProps } = this;

        const nextValue = customNextValue || event.currentTarget[valuePropName];
        const prevValue = customPrevValue || contextProps.get(valuePropName);

        console.groupCollapsed(this.fieldPath, '@ Field @ handleChange');
        console.log('event', event);
        console.log('valuePropName', valuePropName);
        console.log('contextProps', Object.assign({}, contextProps.toJS()));
        console.log('prevValue', prevValue);
        console.log('nextValue', nextValue);
        console.groupEnd();

        this.context.eventEmitter.emit('fieldChange', {
          event,
          nextValue,
          prevValue,
          fieldProps: contextProps
        });
      }

      /**
       * Handles field blur.
       * @param {Event} event
       */
      handleBlur = (event) => {
        this.context.eventEmitter.emit('fieldBlur', {
          event,
          fieldProps: this.contextProps
        });
      }

      render() {
        const { props, contextProps } = this;

        /** Reference to the enforced props from the HOC options */
        const enforcedProps = hocOptions.enforceProps({ props, contextProps });

        /** A mirror reference to "contextProps", an internal field record stored in Form's state */
        const fieldState = contextProps.toJS();

        /** Props to assign to the field component directly (input, select, etc.) */
        const fieldProps = {
          name: fieldState.name,
          type: fieldState.type,
          value: fieldState.controlled ? (props.value || '') : fieldState.value,
          required: fieldState.required,
          disabled: this.props.disabled,

          /* Assign/override the props provided via {options.enforceProps()} */
          ...enforcedProps,

          /* Reference */
          ref: this.getInnerRef,

          /* Explicitly assign event handlers to prevent unwanted override */
          onFocus: this.handleFocus,
          onChange: event => this.handleChange({ event }),
          onBlur: this.handleBlur
        };

        return (
          <WrappedComponent
            { ...props }
            fieldProps={ fieldProps }
            fieldState={ fieldState }
            handleFieldFocus={ this.handleFocus }
            handleFieldChange={ this.handleChange }
            handleFieldBlur={ this.handleBlur } />
        );
      }
    }

    return hoistNonReactStatics(Field, WrappedComponent);
  };
}
