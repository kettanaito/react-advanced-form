/**
 * Record utils.
 * A collection of pure helper functions which perform field record updates.
 * Each function takes a field record and additional parameters and returns
 * the next state of the field record.
 */
import * as R from 'ramda'
import invariant from 'invariant'
import enforceArray from './enforceArray'

/**
 * Creates a new field based on its initial state.
 * @param {Object} initialState
 * @returns {Object}
 */
export const createField = (initialState) => {
  const valuePropName = initialState.valuePropName || 'value'
  const value = initialState[valuePropName]

  return {
    /* Internal */
    fieldGroup: null,
    fieldPath: null,

    /* Basic */
    type: 'text',
    initialValue: value,
    [valuePropName]: value,
    valuePropName,
    focused: false,
    touched: false,
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

    /* Event handlers */
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
    fieldPath && fieldPath.join('.'),
  )

  return R.prop(valuePropName, fieldProps)
}

/**
 * Updates the value prop of the given field with the given next value.
 * Beware that this function references "valuePropName" prop of the given field.
 * Thus, it cannot be used on non-field object.
 * @param {Function|any} nextValueGetter
 * @param {Object} fieldProps
 */
export const setValue = R.curry((nextValueGetter, fieldProps) => {
  const { fieldPath, valuePropName } = fieldProps

  /* Accept "nextValue" as a function to be able to make "setValue" composable */
  const nextValue =
    typeof nextValueGetter === 'function'
      ? nextValueGetter(fieldProps)
      : nextValueGetter

  invariant(
    valuePropName,
    'Failed to set value to `%s` on `%s`: field has no `valuePropName` property.',
    nextValue,
    fieldPath && fieldPath.join('.'),
  )

  return R.assoc(valuePropName, nextValue, fieldProps)
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
    ? R.assoc('errors', errors && enforceArray(errors), fieldProps)
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
  const nextValid = !!value && validated && expected
  const nextInvalid = validated && !expected

  return R.mergeDeepLeft(
    {
      valid: nextValid,
      invalid: nextInvalid,
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
 * @param {Function} nextValueGetter
 * @param {Object} fieldProps
 * @returns {Object}
 */
export const reset = R.curry((nextValueGetter, fieldProps) => {
  return R.compose(
    // Beware that this will set value to "undefined" when no "initialValue" is found
    setValue(nextValueGetter(fieldProps)),
    setErrors(null),
    setTouched(false),
    resetValidationState,
    resetValidityState,
  )(fieldProps)
})

/**
 * Sets the focus of the given field to the next value.
 * @param {boolean} isFocused
 * @param {Object} fieldProps
 * @returns {Object}
 */
export const setFocused = R.assoc('focused')

export const setTouched = R.assoc('touched')
