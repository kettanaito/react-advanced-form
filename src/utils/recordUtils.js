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
 * Updates the given collection with the given field props.
 * @param {Object} fieldProps
 * @param {Object} collection
 */
export const updateCollectionWith = R.curry((fieldProps, collection) => {
  console.error('(recordUtils) Deprecate `updateCollectionWith`')
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
export const setValue = R.curry((nextValueOrGetter, fieldProps, acc) => {
  const { valuePropName } = fieldProps

  /* Accept "nextValue" as a function to be able to make "setValue" composable */
  const nextValue =
    typeof nextValueOrGetter === 'function'
      ? nextValueOrGetter(fieldProps)
      : nextValueOrGetter

  invariant(
    valuePropName,
    'Failed to set value to `%s` on `%s`: field has no `valuePropName` property.',
    nextValue,
    fieldProps.fieldPath && fieldProps.fieldPath.join('.'),
  )

  return R.assoc(valuePropName, nextValue, acc || fieldProps)
})

/**
 * Returns boolean stating if the given field contains value.
 * @param {Object} fieldProps
 */
export const hasValue = (fieldProps) => {
  return fieldProps.assertValue(getValue(fieldProps))
}

/**
 * Sets the given error messages to the given field.
 * When no errors are provided, returns field props intact.
 * @param {string[]} errors
 * @param {Object} fieldProps
 */
export const setErrors = R.curry((errors, fieldProps, acc) => {
  if (!!fieldProps) {
    console.error('(recordUtils) Remove `fieldProps` from `setErrors`.')
  }

  return R.mergeDeepLeft(
    {
      errors:
        typeof errors !== 'undefined'
          ? errors && enforceArray(errors)
          : fieldProps.errors,
    },
    acc,
  )

  // /* Allow explicit "null" for empty "errors" value */
  // return typeof errors !== 'undefined'
  //   ? R.assoc('errors', errors && enforceArray(errors), {})
  //   : {}
})

/**
 * Sets the validity state props (valid/invalid) on the given field.
 * @param {boolean} shouldValidate
 * @param {Object} fieldProps
 * @returns {Object}
 */
export const updateValidityState = R.curry(
  (shouldValidate, fieldProps, acc) => {
    if (!shouldValidate) {
      return resetValidityState({})
    }

    const { validated, expected, errors } = fieldProps
    const value = getValue(fieldProps)
    const nextValid = !!value && validated && expected
    const nextInvalid = validated && !expected
    const nextErrors = expected ? null : errors

    return R.mergeDeepLeft(
      {
        errors: nextErrors,
        valid: nextValid,
        invalid: nextInvalid,
      },
      acc,
    )
  },
)

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
export const reset = R.curry((nextValueGetter, fieldProps) =>
  R.compose(
    // Beware that this sets value to "undefined" when no "initialValue" is found
    setValue(fieldProps.mapValue(nextValueGetter(fieldProps)), fieldProps),
    setErrors(null, fieldProps),
    setPristine(true),
    setTouched(false),
    resetValidationState,
    resetValidityState,
  )({}),
)

/**
 * Sets the focus of the given field to the next value.
 * @param {boolean} isFocused
 * @param {Object} fieldProps
 * @returns {Object}
 */
export const setFocused = R.assoc('focused')

/**
 * Marks the given field as touched.
 * @param {boolean} touched
 * @param {Object} fieldProps
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
