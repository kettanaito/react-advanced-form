/**
 * Record utils.
 * A collection of pure helper functions which do field record updates.
 * Each helper function takes a field record and additional parameters
 * and returns the next state of the field record.
 */
import invariant from 'invariant';
import { Record } from 'immutable';
import camelize from './camelize';

/**
 * Generates a Field class actual to the given initial props.
 * Abstraction over a simple usage of Record to insert a dynamic
 * [valuePropName] property to the Record.
 */
function generateFieldClass(initialProps) {
  const { valuePropName } = initialProps;

  const FieldRecord = new Record({
    ref: null,
    type: 'text',
    name: '',
    fieldGroup: null,
    focused: false,
    initialValue: null,
    [valuePropName]: initialProps.value,
    valuePropName: 'value',

    debounceValidate: null,
    rule: null,
    asyncRule: null,
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
    skip: false,

    reactiveProps: null,
    onFocus: null,
    onChange: null,
    onBlur: null
  }, 'FieldRecord');

  console.log({ valuePropName })
  // const hasCustomValueProp = (valuePropName !== 'value');
  // const customValueGetter = hasCustomValueProp && 'value';

  return class Field extends FieldRecord {
    get fieldPath() {
      const fieldGroup = this.fieldGroup || [];
      return fieldGroup.concat(this.name);
    }

    // get [customValueGetter]() {
    //   return this[this.valuePropName];
    // }
  }
}

/**
 * Creates a new field record based on the given initial props.
 * @param {Object} initialProps
 * @returns {Field}
 */
export function createField(initialProps) {
  invariant(initialProps, 'Cannot create a Field record: expected initial props, ' +
    'but got: %s', initialProps);
  invariant(initialProps.name, 'Cannot create a Field record: expected a `name` ' +
    'to be a string, but got: %s', initialProps.name);

  const Field = generateFieldClass(initialProps);
  return new Field(initialProps);
}

/**
 * Updates the given collection with the given field props.
 * @param {Field} fieldRecord
 * @param {Map} collection
 */
export function updateCollectionWith(fieldRecord, collection) {
  return collection.setIn(fieldRecord.fieldPath, fieldRecord);
}

/**
 * Returns the value of the given field.
 * @param {Field} fieldRecord
 * @returns {any}
 */
export function getValue(fieldRecord) {
  return fieldRecord.get(fieldRecord.get('valuePropName'));
}

/**
 * Updates the value prop of the given field with the given next value.
 * @param {Map} fieldRecord
 * @param {any} nextValue
 */
export function setValue(fieldRecord, nextValue) {
  return fieldRecord.set(fieldRecord.get('valuePropName'), nextValue);
}

/**
 * Sets the given error messages to the given field.
 * When no errors are provided, returns field props intact.
 * @param {Map} fieldRecord
 * @param {???} errors
 */
export function setErrors(fieldRecord, errors = undefined) {
  /* Allow "null" as explicit empty "errors" value */
  return (typeof errors !== 'undefined')
    ? fieldRecord.set('errors', errors)
    : fieldRecord;
}

/**
 * Resets the validity state (valid/invalid) of the given field.
 * @param {Map} fieldRecord
 * @returns {Map}
 */
export function resetValidityState(fieldRecord) {
  return fieldRecord
    .set('valid', false)
    .set('invalid', false);
}

/**
 * Sets the validity state props (valid/invalid) on the given field.
 * @param {Map} fieldRecord
 * @param {Boolean} shouldValidate
 * @returns {Map}
 */
export function setValidityState(fieldRecord, shouldValidate = true) {
  if (!shouldValidate) {
    return resetValidityState(fieldRecord);
  }

  const value = getValue(fieldRecord);
  const validated = fieldRecord.get('validated');
  const expected = fieldRecord.get('expected');
  const valid = !!value && validated && expected;
  const invalid = validated && !expected;

  return fieldRecord
    .set('valid', valid)
    .set('invalid', invalid);
}

export function beginValidation(fieldRecord) {
  return resetValidityState(setErrors(fieldRecord, null));
}

export function endValidation(fieldRecord) {
  return fieldRecord
    .set('focused', false)
    .set('validating', false);
}

/**
 * Resets the validation state of the given field.
 * @param {Map} fieldRecord
 * @returns {Map}
 */
export function resetValidationState(fieldRecord) {
  return fieldRecord
    .set('validating', false)
    .set('validated', false)
    .set('validatedSync', false)
    .set('validatedAsync', false)
    .set('validSync', false)
    .set('validAsync', false);
}

/**
 * Resets the given field to its initial state.
 * @param {Map} fieldRecord
 * @returns {Map}
 */
export function reset(fieldRecord) {
  const clearRecord = fieldRecord.clear();
  return setValue(clearRecord, fieldRecord.get('initialValue'));

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
export function setFocus(fieldRecord, isFocused = true) {
  return fieldRecord.set('focused', isFocused);
}

//
//
//

// 1. validates, returns "expected" and rejected rules
// 2. updates field Map according to validation result
// 3. gets error messages according to validation result
// 4. updates field with error messages

/**
 * Reflects the result of validation to the provided field.
 * @param {ValidationType} type
 * @param {Map} fieldProps
 * @param {ValidationResult} validationResult
 * @param {Boolean} shouldValidate
 * @returns {Map}
 */
export function reflectValidation({ type, fieldProps, validationResult, shouldValidate }) {
  console.warn('should relfect validation result');
  console.log({ type });
  console.log('fieldProps', fieldProps.toJS());
  console.log(validationResult);
  console.log({ shouldValidate });

  //
  // TODO Handle "both" validation type
  //
  const validPropName = camelize('valid', type.name);
  const validatedPropName = camelize('validated', type.name);

  //
  // TODO Validation result interface may change (hopefully)
  //
  const expected = validationResult.expected;

  console.log({ expected });

  const validatedField = fieldProps
    .set('validated', true)
    .set('expected', expected)
    .set(validPropName, expected)
    .set(validatedPropName, true);

  return setValidityState(validatedField, shouldValidate);
}