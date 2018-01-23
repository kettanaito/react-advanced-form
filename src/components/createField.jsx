/**
 * A high-order component to create custom instances of form elements based on the generic Field class.
 * Also suitable for third-party fields integration.
 */
import invariant from 'invariant';
import { Map } from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { isset, IterableInstance, getComponentName, getPropsPatch, fieldUtils } from '../utils';

/** Default options of "connectField()" HOC. */
const defaultOptions = {
  valuePropName: 'value',
  mapPropsToField: ({ fieldRecord }) => fieldRecord,
  enforceProps: () => ({})
};

export default function connectField(options) {
  /** Merge default and custom options. */
  const hocOptions = { ...defaultOptions, ...options };
  const { valuePropName } = hocOptions;

  return function (WrappedComponent) {
    class Field extends React.Component {
      static displayName = `Field.${getComponentName(WrappedComponent)}`

      static defaultProps = {
        type: 'text',
        required: false
      }

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

      constructor(props, context) {
        super(props, context);

        /* Compose proper field path */
        this.fieldPath = fieldUtils.getFieldPath({
          ...props,
          fieldGroup: context.fieldGroup
        });

        /**
         * Register the field in the parent Form's state and store its internal record reference (contextProps).
         * Also, assume the field's contextProps, since they are composed at this moment. There is no need
         * to wait for the next re-rendering to access them.
         */
        this.contextProps = this.registerWith();
      }

      /** Registers the current field within the parent form's state with the given props. */
      registerWith() {
        const { fieldPath } = this;
        const { fields, fieldGroup } = this.context;
        const { value, initialValue } = this.props;

        const contextValue = fields.getIn([this.fieldPath, valuePropName]);

        console.groupCollapsed(fieldPath, '@ registerWith');
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
          controllable: isset(value),
          focused: false,
          disabled: false,

          /* Validation */
          error: null,
          required: this.props.required,
          expected: true,
          valid: false,
          invalid: false,
          validating: false,
          validatedSync: false,
          validSync: false,
          validatedAsync: false,
          validAsync: false,

          /* Events */
          onFocus: this.props.onFocus,
          onChange: this.props.onChange,
          onBlur: this.props.onBlur
        };

        console.log('defaultFieldRecord:', Object.assign({}, defaultFieldRecord));

        /* Get the registration props from the respective lifecycle method */
        const fieldRecord = hocOptions.mapPropsToField({
          fieldRecord: defaultFieldRecord,
          props: this.props,
          context: this.context,
          valuePropName
        });

        console.log('fieldRecord:', fieldRecord);

        /* Prevent { fieldGroup: undefined } for fields without a group */
        if (fieldGroup) fieldRecord.fieldGroup = fieldGroup;

        /* Assign dynamic props in case they are present */
        const dynamicProps = fieldUtils.getDynamicProps(fieldRecord);
        if (dynamicProps.size > 0) fieldRecord.dynamicProps = dynamicProps;

        console.log('dynamicProps', dynamicProps);
        console.log('register with:', Object.assign({}, fieldRecord));
        console.groupEnd();

        const fieldProps = Map(fieldRecord);

        /**
         * Notify the parent Form that a new field attempts to register.
         * Timeout makes this action async, hence each registration attempt may access the actual state of the form by the
         * time the registration happens. Otherwise, registrations happen at approximately same time, resulting into fields
         * being unaware of each other.
         */
        setTimeout(() => this.context.registerField(fieldProps), 0);

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
        const controllable = contextProps.get('controllable');
        const nextValue = nextProps[valuePropName];
        const prevValue = this.props[valuePropName];

        if (controllable && (nextValue !== prevValue)) {
          this.context.handleFieldChange({
            nextValue,
            prevValue,
            fieldProps: contextProps
          });
        }

        // TODO This is worth redoing!
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

      /** Ensures "this.contextProps" is always actual. */
      componentWillUpdate(nextProps, nextState, nextContext) {
        const nextContextProps = nextContext.fields.getIn([this.fieldPath]);

        /* Bypass contextProps updates when field is updated, but not yet registred in the Form's state */
        if (!nextContextProps) return;

        /* Update the internal reference to contextProps */
        this.contextProps = nextContextProps;
      }

      componentWillUnmount() {
        /* Deletes the field's bindings from the Form on unmounting */
        this.context.unregisterField(this.contextProps);
      }

      handleFocus = event => this.context.handleFieldFocus({
        event,
        fieldProps: this.contextProps
      })

      handleChange = ({ event, nextValue: customNextValue, prevValue: customPrevValue }) => {
        const { contextProps } = this;

        const nextValue = customNextValue || event.currentTarget[valuePropName];
        const prevValue = customPrevValue || contextProps.get(valuePropName);

        const hasChangeHandler = contextProps.get('controllable') ? this.props.onChange : true;

        console.groupCollapsed(this.fieldPath, '@ Field @ handleChange');
        console.log('valuePropName', valuePropName);
        console.log('contextProps', Object.assign({}, contextProps.toJS()));
        console.log('prevValue', prevValue);
        console.log('nextValue', nextValue);
        console.log('hasChangeHandler', hasChangeHandler);
        console.log('this.context.handleFieldChange', this.context.handleFieldChange);
        console.groupEnd();

        invariant(hasChangeHandler, `Cannot update the controlled field \`${contextProps.get('name')}\`. Expected custom \`onChange\` handler, but received: ${this.props.onChange}.`);

        this.context.handleFieldChange({
          event,
          fieldProps: contextProps,
          nextValue,
          prevValue
        });
      }

      handleBlur = event => this.context.handleFieldBlur({
        event,
        fieldProps: this.contextProps
      })

      handleFieldChange = ({ event, nextValue, prevValue }) => {
        const { contextProps } = this;
        const valuePropName = contextProps.get('valuePropName');

        this.context.handleFieldChange({
          event,
          fieldProps: contextProps,
          nextValue,
          prevValue: prevValue || contextProps.get(valuePropName)
        });
      }

      render() {
        const { props, contextProps } = this;

        /** Reference to the enforced props from the HOC options */
        const enforcedProps = hocOptions.enforceProps(props, contextProps);

        /** A mirror reference to "contextProps", an internal field record stored in Form's state */
        const fieldState = contextProps.toJS();

        /** Props to assign to the field component directly (input, select, etc.) */
        const fieldProps = {
          name: fieldState.name,
          type: fieldState.type,
          value: fieldState.controllable ? props.value : fieldState.value,
          required: fieldState.required,
          disabled: fieldState.disabled,

          /* Assign/override the props provided via {options.enforceProps()} */
          ...enforcedProps,

          /* Explicitly assign event handlers to prevent unwanted override */
          onFocus: this.handleFocus,
          onChange: event => this.handleChange({ event }),
          onBlur: this.handleBlur
        };

        return (
          <WrappedComponent
            { ...props }
            fieldState={ fieldState }
            fieldProps={ fieldProps }
            handleFieldFocus={ this.handleFocus }
            handleFieldChange={ this.handleChange }
            handleFieldBlur={ this.handleBlur } />
        );
      }
    }

    return hoistNonReactStatics(Field, WrappedComponent);
  };
}
