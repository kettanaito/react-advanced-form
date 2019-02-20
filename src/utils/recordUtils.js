/**
 * Record utils.
 * A collection of pure helper functions which perform field state updates.
 * Each function takes a field state and additional parameters and returns
 * the next field state patch.
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
    mapValue: R.always,
    assertValue: R.complement(R.isNil),
    serialize: R.always,

    /* Basic */
    initialValue: value,
    [valuePropName]: value,
    valuePropName,

    /* Interaction state */
    focused: false,
    pristine: true,
    touched: false,

    /* Validation */
    required: false,
    skip: false,
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

    reactiveProps: null,

    /* Event handlers */
    onFocus: null,
    onChange: null,
    onBlur: null,

    ...initialState,
  }
}

/**
 * Returns the value of the given field.
 * @param {Object} fieldState
 * @returns {any}
 */
export const getValue = (fieldState) => {
  const { fieldPath, valuePropName } = fieldState

  invariant(
    fieldPath,
    'Failed to get field value: provided object is not a field: %o',
    fieldState,
  )

  invariant(
    valuePropName,
    'Failed to get value of the `%s`: field has no `valuePropName` property.',
    fieldPath && fieldPath.join('.'),
  )

  return R.prop(valuePropName, fieldState)
}

/**
 * Updates the value prop of the given field with the given next value.
 * Beware that this function references "valuePropName" prop of the given field.
 * Thus, it cannot be used on non-field object.
 * @param {Function|any} nextValueGetter
 * @param {Object} fieldState
 */
export const setValue = R.curry((nextValueOrGetter, fieldState, acc) => {
  const { valuePropName } = fieldState

  /* Accept "nextValue" as a function to be able to make "setValue" composable */
  const nextValue =
    typeof nextValueOrGetter === 'function'
      ? nextValueOrGetter(fieldState)
      : nextValueOrGetter

  invariant(
    valuePropName,
    'Failed to set value to `%s` on `%s`: field has no `valuePropName` property.',
    nextValue,
    fieldState.fieldPath && fieldState.fieldPath.join('.'),
  )

  /**
   * @todo Must never assoc next state patch on "fieldState".
   * Always return the patch chunk.
   */
  return R.assoc(valuePropName, nextValue, acc || fieldState)
})

/**
 * Returns boolean stating if the given field contains value.
 * @param {Object} fieldState
 */
export const hasValue = (fieldState) => {
  return fieldState.assertValue(getValue(fieldState))
}

/**
 * Sets the given error messages to the given field.
 * When no errors are provided, returns field props intact.
 * @param {string[]} errors
 */
export const setErrors = R.curry((errors, acc) => {
  return typeof errors !== 'undefined'
    ? R.assoc('errors', errors && enforceArray(errors), acc)
    : acc
})

/**
 * Sets the validity state props (valid/invalid) on the given field.
 * @param {Object} fieldState
 * @returns {Object}
 */
export const updateValidityState = R.curry((fieldState, acc) => {
  const { validated, expected } = acc
  const value = getValue(fieldState)

  return R.mergeDeepLeft(
    {
      valid: !!value && !!validated && !!expected,
      invalid: !!validated && !expected,
    },
    acc,
  )
})

/**
 * Resets the validity state (valid/invalid) of the given field.
 * @param {Object} fieldState
 * @returns {Object}
 */
export const resetValidityState = R.mergeDeepLeft({
  valid: false,
  invalid: false,
})

/**
 * Resets the validation state of the given field.
 * @param {Object} fieldState
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
 * @param {Object} fieldState
 * @returns {Object}
 */
export const reset = R.curry((nextValueGetter, fieldState) =>
  R.compose(
    // Beware that this sets value to "undefined" when no "initialValue" is found
    setValue(fieldState.mapValue(nextValueGetter(fieldState)), fieldState),
    setErrors(null),
    setPristine(true),
    setTouched(false),
    resetValidationState,
    resetValidityState,
  )({}),
)

/**
 * Sets the focus of the given field to the next value.
 * @param {boolean} isFocused
 * @param {Object} fieldState
 * @returns {Object}
 */
export const setFocused = R.assoc('focused')

/**
 * Marks the given field as touched.
 * @param {boolean} touched
 * @param {Object} fieldState
 * @returns {Object}
 */
export const setTouched = R.assoc('touched')

/**
 * Sets the next value of a field's "pristine" property.
 * @param {boolean} pristine
 * @param {Object} fieldState
 * @returns {Object}
 */
export const setPristine = R.assoc('pristine')
