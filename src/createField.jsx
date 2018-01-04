/**
 * A high-order component to create custom instances of form elements basedc on the generic Field class.
 * Also suitable for third-party fields integration.
 */
import invariant from 'invariant';
import { Map } from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import defaultFieldProps from './const/default-field-props';
import { IterableInstance, getComponentName, isset, getPropsPatch, fieldUtils } from './utils';

/* Default "createField" options */
const defaultOptions = {
  valueProp: 'value',
  mapPropsToField: props => props
};

export default function createField(options) {
  /* Merge default and custom options */
  const resolvedOptions = { ...defaultOptions, ...options };

  return function (WrappedComponent) {
    class Field extends React.Component {
      static displayName = `Field.${getComponentName(WrappedComponent)}`

      static defaultProps = defaultFieldProps

      /* Context types expected by the field */
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

        /* Get the registration props from the respective lifecycle method */
        const registrationProps = resolvedOptions.mapPropsToField(props);

        /**
         * Register the field in the parent Form's state and store its internal record reference (contextProps).
         * Also, assume the field's contextProps, since they are composed at this moment. There is no need
         * to wait for the next re-rendering to access them.
         */
        this.contextProps = this.registerWith(registrationProps);
      }

      /**
       * Registers the current field within the parent form's state with the given props.
       * @param {Object} props
       */
      registerWith(props) {
        const { fields, fieldGroup, registerField } = this.context;
        const { value, initialValue } = props;

        const contextValue = fields.getIn([this.fieldPath, 'value']);

        console.groupCollapsed(this.fieldPath, '@ registerWith');
        console.log('props', Object.assign({}, this.props));
        console.log('value', value);
        console.log('initialValue', initialValue);
        console.log('context value', contextValue);

        /* Get the proper field value to register with */
        const fallbackValue = (value || initialValue || '');
        const registeredValue = isset(contextValue) ? contextValue : fallbackValue;

        const registrationProps = {
          ...props,
          ref: this,
          fieldPath: this.fieldPath,
          controllable: isset(value),
          value: registeredValue,
          initialValue: initialValue || registeredValue,
          validSync: false,
          validAsync: false,
          validatedSync: false,
          validatedAsync: false
        };

        /* Prevent { fieldGroup: undefined } for fields without a group */
        if (fieldGroup) {
          registrationProps.fieldGroup = fieldGroup;
        }

        /* Check if dynamic props are present */
        const dynamicProps = fieldUtils.getDynamicProps(props);

        /* Assign dynamic props in case they are present */
        if (dynamicProps.size > 0) {
          registrationProps.dynamicProps = dynamicProps;
        }

        console.log('dynamicProps', dynamicProps);
        console.log('register with:', Object.assign({}, registrationProps));
        console.groupEnd();

        const fieldProps = Map(registrationProps);

        /**
         * Notify the parent Form that a new field has to register.
         * Timeout makes this action async, hence each registration attempt may access the actual state of the form by the
         * time the registration happens. Otherwise, registrations happen at approximately same time, resulting into fields
         * being unaware of each other.
         */
        setTimeout(() => registerField(fieldProps), 0);

        return fieldProps;
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
       * Ensures "this.contextProps" is updated accoding to the component updates.
       */
      componentWillUpdate(nextProps, nextState, nextContext) {
        const nextContextProps = nextContext.fields.getIn([this.fieldPath]);

        /* Bypass contextProps updates when field is updated, but not yet registred in the Form's state */
        if (!nextContextProps) return;

        /* Update the internal reference to contextProps */
        this.contextProps = nextContextProps;
      }

      /**
       * Deletes the field's bindings from the Form on unmounting.
       */
      componentWillUnmount() {
        return this.context.unregisterField(this.contextProps);
      }

      /**
       * Handles field's focus.
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
        const { valueProp } = resolvedOptions;
        const { [valueProp]: nextValue } = event.currentTarget;
        const { contextProps } = this;

        const prevValue = contextProps.get(valueProp);
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

      render() {
        const { props: directProps, contextProps } = this;

        /* Get the enforced props from HoC options */
        const { enforceProps } = resolvedOptions;
        const enforcedProps = enforceProps ? enforceProps(directProps, contextProps) : {};

        return (
          <WrappedComponent
            /* Assign all props passed to the WrappedComponent */
            { ...WrappedComponent.props }

            /* Assign contextProps necessary for proper field management */
            name={ contextProps.get('name') }
            type={ contextProps.get('type') }
            value={ contextProps.get('controllable') ? directProps.value : contextProps.get('value') }
            required={ contextProps.get('required') }
            disabled={ contextProps.get('disabled') }

            /* Assign props passed to the "Field" generic component */
            placeholder={ directProps.placeholder }
            style={ directProps.style }

            /* Assign/override the props provided via {options.enforceProps()} */
            { ...enforcedProps }

            /* Explicitly assign event handlers to prevent unwanted override */
            onFocus={ this.handleFocus }
            onChange={ this.handleChange }
            onBlur={ this.handleBlur }>
            { directProps.children }
          </WrappedComponent>
        );
      }
    }

    /* Ensure static properties are hoisted */
    return hoistNonReactStatics(Field, WrappedComponent);
  };
}
