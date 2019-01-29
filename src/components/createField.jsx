/**
 * A high-order component which provides the reference of the field's record to the wrapped
 * component. Used for custom field styling, implementing fields with custom logic, and
 * third-party field components integration.
 */
import * as R from 'ramda'
import React from 'react'
import PropTypes from 'prop-types'
import hoistNonReactStatics from 'hoist-non-react-statics'
import {
  isset,
  camelize,
  debounce,
  getComponentName,
  recordUtils,
  rxUtils,
  warning,
} from '../utils'

/* Default options for `connectField()` HOC */
const defaultOptions = {
  allowMultiple: false,
  valuePropName: 'value',
  initialValue: '',
  mapPropsToField({ fieldRecord }) {
    return fieldRecord
  },
  beforeRegister({ fieldProps }) {
    return fieldProps
  },
  shouldValidateOnMount({ valuePropName, fieldRecord }) {
    return this.assertValue(fieldRecord[valuePropName])
  },
  shouldUpdateRecord({ prevValue, nextValue }) {
    return prevValue !== nextValue
  },
  enforceProps() {
    return {}
  },
  mapValue(nextValue) {
    return nextValue
  },
  assertValue(value) {
    return !!value
  },
  serialize(value) {
    return value
  },
}

/**
 * Returns the initial value for the given fields.
 * Takes field props, initial values of a form and field's class into account.
 * @param {string[]} fieldPath
 * @param {Object} fieldProps
 * @param {Object} initialValues
 * @param {Object} hocOptions
 * @returns {string?}
 */
const getInitialValue = (fieldPath, fieldProps, initialValues, hocOptions) => {
  return (
    fieldProps.initialValue ||
    (initialValues && R.path(fieldPath, initialValues)) ||
    hocOptions.initialValue
  )
}

export default function connectField(options) {
  const hocOptions = { ...defaultOptions, ...options }
  const { valuePropName } = hocOptions

  return function(WrappedComponent) {
    class Field extends React.Component {
      static displayName = `Field.${getComponentName(WrappedComponent)}`

      static propTypes = {
        skip: PropTypes.bool,
      }

      static defaultProps = {
        disabled: false,
        required: false,
      }

      static contextTypes = {
        form: PropTypes.object,
        fields: PropTypes.object,
        fieldGroup: PropTypes.arrayOf(PropTypes.string),
      }

      constructor(props, context) {
        super(props, context)
        const { fieldGroup, form } = context
        const { name } = props

        /* Compose the field path */
        this.__fieldPath = fieldGroup ? [...fieldGroup, name] : [name]

        /**
         * Register the field in the parent Form's state and store its internal record
         * reference (contextProps). Also, assume the field's contextProps, since they
         * are composed at this moment. There is no need to wait for the next
         * re-rendering to access them.
         */
        this.contextProps = form && this.register()
      }

      /* Registers the current field within the parent form's state */
      register() {
        const { props: directProps, context, __fieldPath } = this
        const { fields, fieldGroup, form } = context
        const value = directProps[valuePropName]
        const contextValue = R.path(__fieldPath.concat(valuePropName), fields)

        const { reactiveProps, prunedProps } = rxUtils.getRxProps(directProps)

        /* Set value and initial value */
        const initialValue = getInitialValue(
          __fieldPath,
          directProps,
          form.props.initialValues,
          hocOptions,
        )
        const registeredValue = isset(contextValue)
          ? contextValue
          : value || initialValue

        const initialFieldProps = {
          ...prunedProps,
          getRef: () => this,
          fieldGroup,
          fieldPath: __fieldPath,
          valuePropName,
          [valuePropName]: hocOptions.mapValue(registeredValue),
          /**
           * Store the pristine initial value to assign it
           * on reseting the field. "getInitialValue" will be
           * invoked with the prisine initialValue during reset
           * inside "recordUtils.reset()".
           */
          initialValue: initialValue || registeredValue,
          controlled: prunedProps.hasOwnProperty(
            'value',
          ) /** @todo Checkboxes are always uncontrolled */,
          required: prunedProps.required,
          reactiveProps,

          /**
           * @todo
           * Debounce an isolate validateField method to handle formless fields.
           *
           * When the validate method is debounced on the form level, different
           * calls to it from different fields are going to overlap and conflict
           * with each other. Wrapping the validate method for each field means
           * that each re-occuring call to that method is going to be debounced
           * relatively to the field, regardless of the other fields being validated.
           */
          debounceValidate: debounce(form.validateField, form.debounceTime),
          // skip: prunedProps.skip,

          rule: prunedProps.rule,
          asyncRule: prunedProps.asyncRule,
          onFocus: prunedProps.onFocus,
          onChange: prunedProps.onChange,
          onBlur: prunedProps.onBlur,

          /* Internal methods */
          mapValue: hocOptions.mapValue,
          assertValue: hocOptions.assertValue,
          serialize: hocOptions.serialize,
        }

        /* (Optional) Alter the field record using HOC options */
        const mappedFieldProps = hocOptions.mapPropsToField({
          fieldRecord: initialFieldProps /** @todo Adopt "fieldState" namespace */,
          props: prunedProps,
          valuePropName,
          context,
        })

        const fieldRecord = recordUtils.createField(mappedFieldProps)

        /* Notify the parent Form that a new field prompts to register */
        form.eventEmitter.emit('fieldRegister', {
          fieldProps: fieldRecord,
          fieldOptions: {
            allowMultiple: hocOptions.allowMultiple,
            beforeRegister: hocOptions.beforeRegister,
            shouldValidateOnMount: hocOptions.shouldValidateOnMount({
              fieldRecord,
              props: directProps,
              context: this.context,
              valuePropName,
              [valuePropName]: recordUtils.getValue(fieldRecord),
            }),
          },
        })

        return fieldRecord
      }

      componentWillReceiveProps(nextProps) {
        const { props: prevProps, contextProps } = this
        if (!contextProps) {
          return
        }

        /**
         * Handle value change of controlled fields.
         * The responsibility of value update of controlled fields is delegated
         * to the end developer. However, that still means that the new value
         * should be propagated to the Form's state to guarantee the field's
         * internal record is updated respectively.
         */
        const { controlled } = contextProps
        const nextValue = nextProps[valuePropName]
        const prevValue = prevProps[valuePropName]

        const shouldUpdateRecord = hocOptions.shouldUpdateRecord({
          nextValue,
          prevValue,
          prevProps,
          nextProps,
          contextProps,
        })

        if (controlled && shouldUpdateRecord) {
          this.context.form.eventEmitter.emit('fieldChange', {
            event: {
              nativeEvent: {
                isForcedUpdate: true,
              },
            },
            nextValue,
            prevValue,
            fieldProps: contextProps,
          })
        }
      }

      /**
       * Ensure "this.contextProps" reference is updated according to the context updates.
       */
      componentWillUpdate(nextProps, nextState, nextContext) {
        /* Bypass scenarios when field is being updated, but not yet registred within the Form */
        const nextContextProps = R.path(this.__fieldPath, nextContext.fields)

        if (!nextContextProps) {
          return
        }

        /* Update the internal reference to contextProps */
        const { props: prevProps, contextProps: prevContextProps } = this
        this.contextProps = nextContextProps

        const propsChangeEvent = camelize(
          ...nextContextProps.fieldPath,
          'props',
          'change',
        )

        this.context.form.eventEmitter.emit(propsChangeEvent, {
          prevTargetProps: prevProps,
          nextTargetProps: nextProps,
          prevTargetRecord: prevContextProps,
          nextTargetRecord: nextContextProps,
        })
      }

      /**
       * Deletes the field's record upon unmounting.
       */
      componentWillUnmount() {
        this.context.form.eventEmitter.emit(
          'fieldUnregister',
          this.contextProps,
        )
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
        this.innerRef = Component

        /**
         * Allow direct reference to inner component.
         * <CustomField innerRef={...} />
         *
         * First, check if the component where "fieldProps" are destructued is another
         * React Component. This means, that the end developer wrapped the "input" with
         * another React Component. In that case "innerRef" will not return the actual
         * "input", but custom React Component, which would be the same what "innerRef"
         * references. In that case, omit explicit call of "innerRef".
         */
        if (Component instanceof React.Component) {
          return
        }

        const { innerRef } = this.props
        if (innerRef) {
          innerRef(Component)
        }
      }

      /**
       * Handles field focus.
       * @param {Event} event
       */
      handleFocus = (event) => {
        this.context.form.eventEmitter.emit('fieldFocus', {
          event,
          fieldProps: this.contextProps,
        })
      }

      /**
       * Handles field change.
       * @param {Event} event
       * @param {any} nextValue
       * @param {any} prevValue
       */
      handleChange = (args) => {
        const {
          event,
          nextValue: customNextValue,
          prevValue: customPrevValue,
        } = args
        const {
          contextProps,
          context: { form },
        } = this

        const nextValue = args.hasOwnProperty('nextValue')
          ? customNextValue
          : event.currentTarget[valuePropName]

        const prevValue = args.hasOwnProperty('prevValue')
          ? customPrevValue
          : contextProps[valuePropName]

        form.eventEmitter.emit('fieldChange', {
          event,
          nextValue,
          prevValue,
          fieldProps: contextProps,
        })
      }

      /**
       * Handles field blur.
       * @param {Event} event
       */
      handleBlur = (event) => {
        this.context.form.eventEmitter.emit('fieldBlur', {
          event,
          fieldProps: this.contextProps,
        })
      }

      render() {
        const { props, contextProps } = this
        
        /* Render null and log warning in case of formless field */
        if (!contextProps) {
          warning(
            false,
            'Failed to render the field `%s`: expected to be a child ' +
              'of a Form component. Please render fields as children of ' +
              'Form, since formless fields are not currently supported.',
            props.name,
          )
          return null
        }

        /* Reference to the enforced props from the HOC options */
        const enforcedProps = hocOptions.enforceProps({ props, contextProps })
        const { valuePropName } = contextProps
        const value = contextProps.controlled
          ? props[valuePropName] || ''
          : contextProps[valuePropName]

        /* Props to assign to the field component directly (input, select, etc.) */
        const fieldProps = {
          name: contextProps.name,
          type: contextProps.type,
          [valuePropName]: value,
          required: contextProps.required,
          disabled: this.props.disabled,

          /* Assign/override the props provided via {options.enforceProps()} */
          ...enforcedProps,

          /* Reference */
          ref: this.getInnerRef,

          /* Explicitly assign event handlers to prevent unwanted override */
          onFocus: this.handleFocus,
          onChange: (event) => this.handleChange({ event }),
          onBlur: this.handleBlur,
        }

        return (
          <WrappedComponent
            {...props}
            fieldProps={fieldProps}
            fieldState={contextProps}
            handleFieldFocus={this.handleFocus}
            handleFieldChange={this.handleChange}
            handleFieldBlur={this.handleBlur}
          />
        )
      }
    }

    return hoistNonReactStatics(Field, WrappedComponent)
  }
}
