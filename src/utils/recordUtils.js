/**
 * Record utils.
 * A collection of pure helper functions which perform field record updates.
 * Each function takes a field record and additional parameters and returns
 * the next state of the field record.
 */
import * as R from 'ramda'
import invariant from 'invariant'

/**
 * Generates a Field class relative to the given initial props.
 * Abstraction over a simple Record in order to insert field-specific
 * properties to it (i.e. "valuePropName", "checked", etc.).
 */
// const generateFieldClass = (initialProps) => {
//   const { valuePropName } = initialProps
//   const value = initialProps[valuePropName]

//   //
//   // TODO
//   // Field record must contain ALL the initial data specific to the field.
//   // For example, type: "radio" for "radio" fields, proper initialValue, rule, asyncRule,
//   // reactiveProps, etc.
//   //
//   const FieldRecord = new Record(
//     {
//       /* Internal */
//       ref: null,
//       fieldGroup: null,
//       fieldPath: null,

//       /* Basic */
//       type: 'text',
//       initialValue: value, // TODO Shouldn't this be set here?
//       [valuePropName]: value,
//       valuePropName: 'value',

//       // TODO "radio" field cannot propagate "checked" prop, not in the record
//       focused: false,
//       checked: null,
//       skip: false,

//       /* Validation */
//       rule: null,
//       asyncRule: null,
//       pendingAsyncValidation: null,
//       debounceValidate: null,
//       errors: null,
//       expected: true,
//       valid: false,
//       invalid: false,
//       validating: false,
//       validated: false,
//       validatedSync: false,
//       validSync: false,
//       validatedAsync: false,
//       validAsync: false,
//       required: false,

//       reactiveProps: null,

//       /* Event callbacks/handlers */
//       onFocus: null,
//       onChange: null,
//       onBlur: null,

//       ...initialProps,
//     },
//     'FieldRecord',
//   )

//   return class Field extends FieldRecord {
//     get displayFieldPath() {
//       return this.fieldPath.join('.')
//     }
//   }
// }

/**
 * Creates a new field based on its initial state.
 * @param {Object} initialState
 * @returns {Field}
 */
export const createField = (initialState) => {
  const { valuePropName } = initialState
  const value = initialState[valuePropName]

  return {
    /* Internal */
    ref: null,
    fieldGroup: null,
    fieldPath: null,

    /* Basic */
    type: 'text',
    initialValue: value, // TODO Should this be set here?
    [valuePropName]: value,
    valuePropName: 'value',
    focused: false,
    skip: false,

    /* Validation */
    rule: null,
    asyncRule: null,
    pendingAsyncValidation: null,
    debounceValidate: null,
    errors: null,
    expected: true,
    valid: false,
    invalid: false,
    validating: false,
    validated: false,
    validatedSync: false,
    validSync: false,
    validatedAsync: false,
    validAsync: false,
    required: false,

    reactiveProps: null,

    /* Event callbacks/handlers */
    onFocus: null,
    onChange: null,
    onBlur: null,

    ...initialState,
  }
}

/**
 * Updates the given collection with the given field props.
 * @param {Object} fieldProps
 * @param {Object} collection
 */
export const updateCollectionWith = R.curry((fieldProps, collection) => {
  return R.assocPath(fieldProps.fieldPath, fieldProps, collection)
})

/**
 * Returns the value of the given field.
 * @param {Object} fieldProps
 * @returns {any}
 */
export const getValue = (fieldProps) => {
  const { fieldPath, valuePropName } = fieldProps

  invariant(
    fieldPath,
    'Failed to get field value: provided object is not a field: %s',
    Object.keys(fieldProps).join(),
  )

  invariant(
    valuePropName,
    'Failed to get value of the `%s`: field has no `valuePropName` property.',
    fieldPath.join('.'),
  )

  return R.prop(valuePropName, fieldProps)
}

/**
 * Updates the value prop of the given field with the given next value.
 * Beware that this function references "valuePropName" prop of the given field.
 * Thus, it cannot be used on non-field object.
 * @param {Object} fieldProps
 * @param {any} nextValue
 */
export const setValue = R.curry((nextValue, fieldProps) => {
  const { fieldPath, valuePropName } = fieldProps

  invariant(
    valuePropName,
    'Failed to set value to `%s` on `%s`: field has no `valuePropName` property.',
    nextValue,
    fieldPath.join('.'),
  )

  /* Accept "nextValue" as a function to be able to make "setValue" composable */
  const assocValue = typeof nextValue === 'function' ? nextValue(fieldProps) : nextValue

  return R.assoc(valuePropName, assocValue, fieldProps)
})

/**
 * Sets the given error messages to the given field.
 * When no errors are provided, returns field props intact.
 * @param {string[]} errors
 * @param {Object} fieldProps
 */
export const setErrors = R.curry((errors, fieldProps) => {
  /* Allow explicit "null" for empty "errors" value */
  return typeof errors !== 'undefined'
    ? R.assoc('errors', errors, fieldProps)
    : fieldProps
})

/**
 * Resets the validity state (valid/invalid) of the given field.
 * @param {Object} fieldProps
 * @returns {Object}
 */
export const resetValidityState = R.mergeDeepLeft({
  valid: false,
  invalid: false,
})

/**
 * Sets the validity state props (valid/invalid) on the given field.
 * @param {Object} fieldProps
 * @param {boolean} shouldValidate
 * @returns {Object}
 */
export const updateValidityState = R.curry((shouldValidate, fieldProps) => {
  if (!shouldValidate) {
    return resetValidityState(fieldProps)
  }

  const { validated, expected } = fieldProps
  const value = getValue(fieldProps)

  return R.mergeDeepLeft(
    {
      valid: !!value && validated && expected,
      invalid: validated && !expected,
    },
    fieldProps,
  )
})

/**
 * Resets the validation state of the given field.
 * @param {Object} fieldProps
 * @returns {Object}
 */
export const resetValidationState = R.mergeDeepLeft({
  validating: false,
  validated: false,
  validatedSync: false,
  validatedAsync: false,
  validSync: false,
  validAsync: false,
})

/**
 * Resets the given field to its initial state.
 * @param {Object} fieldProps
 * @returns {Object}
 */
export const reset = R.compose(
  setValue(R.prop('initialValue')), // TODO This most likely works wrong
  setErrors(null),
  resetValidationState,
  resetValidityState,
)

/**
 * Sets the focus of the given field to the next value.
 * @param {boolean} isFocused
 * @param {Object} fieldProps
 * @returns {Object}
 */
export const setFocus = R.assoc('focused')
