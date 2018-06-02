/**
 * Record utils.
 * A collection of pure helper functions which perform field record updates.
 * Each function takes a field record and additional parameters and returns
 * the next state of the field record.
 */
import { Record } from 'immutable'

/**
 * Generates a Field class relative to the given initial props.
 * Abstraction over a simple Record in order to insert field-specific
 * properties to it (i.e. "valuePropName", "checked", etc.).
 */
const generateFieldClass = (initialProps) => {
  const { valuePropName } = initialProps
  const value = initialProps[valuePropName]

  //
  // TODO
  // Field record must contain ALL the initial data specific to the field.
  // For example, type: "radio" for "radio" fields, proper initialValue, rule, asyncRule,
  // reactiveProps, etc.
  //
  const FieldRecord = new Record(
    {
      /* Internal */
      ref: null,
      fieldGroup: null,

      /* Basic */
      type: 'text',
      initialValue: value, // TODO Shouldn't this be set here?
      [valuePropName]: value,
      valuePropName: 'value',

      // TODO "radio" field cannot propagate "checked" prop, not in the record
      focused: false,
      checked: null,
      skip: false,

      /* Validation */
      rule: null,
      asyncRule: null,
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

      ...initialProps,
    },
    'FieldRecord',
  )

  return class Field extends FieldRecord {
    get fieldPath() {
      const fieldGroup = this.fieldGroup || []
      return fieldGroup.concat(this.name)
    }

    get displayFieldPath() {
      return this.fieldPath.join('.')
    }
  }
}

/**
 * Creates a new field record based on the given initial props.
 * @param {Object} initialProps
 * @returns {Field}
 */
export const createField = (initialProps) => {
  const FieldRecord = generateFieldClass(initialProps)
  return new FieldRecord(initialProps)
}

/**
 * Updates the given collection with the given field props.
 * @param {Field} fieldRecord
 * @param {Map} collection
 */
export const updateCollectionWith = (fieldRecord, collection) => {
  return collection.setIn(fieldRecord.fieldPath, fieldRecord)
}

/**
 * Returns the value of the given field.
 * @param {Field} fieldRecord
 * @returns {any}
 */
export const getValue = (fieldRecord) => {
  return fieldRecord.get(fieldRecord.get('valuePropName'))
}

/**
 * Updates the value prop of the given field with the given next value.
 * @param {Map} fieldRecord
 * @param {any} nextValue
 */
export function setValue(fieldRecord, nextValue) {
  return fieldRecord.set(fieldRecord.get('valuePropName'), nextValue)
}

/**
 * Sets the given error messages to the given field.
 * When no errors are provided, returns field props intact.
 * @param {Map} fieldRecord
 * @param {???} errors
 */
export const setErrors = (fieldRecord, errors = undefined) => {
  /* Allow "null" as explicit empty "errors" value */
  return typeof errors !== 'undefined'
    ? fieldRecord.set('errors', errors)
    : fieldRecord
}

/**
 * Resets the validity state (valid/invalid) of the given field.
 * @param {Map} fieldRecord
 * @returns {Map}
 */
export const resetValidityState = (fieldRecord) => {
  return fieldRecord.merge({
    valid: false,
    invalid: false,
  })
}

/**
 * Sets the validity state props (valid/invalid) on the given field.
 * @param {Map} fieldRecord
 * @param {Boolean} shouldValidate
 * @returns {Map}
 */
export const updateValidityState = (fieldRecord, shouldValidate = true) => {
  if (!shouldValidate) {
    return resetValidityState(fieldRecord)
  }

  const { validated, expected } = fieldRecord
  const value = getValue(fieldRecord)
  const nextValid = !!value && validated && expected
  const nextInvalid = validated && !expected

  return fieldRecord.merge({
    valid: nextValid,
    invalid: nextInvalid,
  })
}

export const beginValidation = (fieldRecord) => {
  return resetValidityState(setErrors(fieldRecord, null))
}

export const endValidation = (fieldRecord) => {
  return fieldRecord.merge({
    focused: false,
    validating: false,
  })
}

/**
 * Resets the validation state of the given field.
 * @param {Map} fieldRecord
 * @returns {Map}
 */
export const resetValidationState = (fieldRecord) => {
  return fieldRecord.merge({
    validating: false,
    validated: false,
    validatedSync: false,
    validatedAsync: false,
    validSync: false,
    validAsync: false,
  })
}

/**
 * Resets the given field to its initial state.
 * @param {Map} fieldRecord
 * @returns {Map}
 */
export const reset = (fieldRecord) => {
  return fieldRecord.clear()

  // return resetValidationState(
  //   resetValidityState(
  //     setValue(
  //       setErrors(
  //         fieldRecord.set('expected', true),
  //         null
  //       ),
  //       initialValue
  //     )
  //   )
  // );
}

/**
 * Sets the given field's focus.
 * @param {Map} fieldRecord
 * @param {Boolean} isFocused
 * @returns {Map}
 */
export const setFocus = (fieldRecord, isFocused = true) => {
  return fieldRecord.set('focused', isFocused)
}
