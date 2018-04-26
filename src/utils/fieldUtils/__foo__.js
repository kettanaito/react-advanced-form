/**
 * Record utils.
 * A collection of pure helper functions which do field record updates.
 * Each helper function takes a field record and additional parameters
 * and returns the next state of the field record.
 */
import camelize from '../camelize';

/**
 * Updates the given collection with the given field props.
 * @param {Map} fieldProps
 * @param {Map} collection
 */
export function updateCollectionWith(fieldProps, collection) {
  return collection.setIn(fieldProps.get('fieldPath'), fieldProps);
}

/**
 * Returns the value of the given field.
 * @param {Map} fieldProps
 * @returns {any}
 */
export function getValue(fieldProps) {
  return fieldProps.get(fieldProps.get('valuePropName'));
}

/**
 * Updates the value prop of the given field with the given next value.
 * @param {Map} fieldProps
 * @param {any} nextValue
 */
export function setValue(fieldProps, nextValue) {
  return fieldProps.set(fieldProps.get('valuePropName'), nextValue);
}

export function startValidation(fieldProps) {
  return resetValidityState(setErrors(fieldProps, null));
}

/**
 * Sets the validity state props (valid/invalid) on the given field.
 * @param {Map} fieldProps
 * @param {Boolean} shouldValidate
 * @returns {Map}
 */
export function setValidityState(fieldProps, shouldValidate = true) {
  if (!shouldValidate) {
    return resetValidityState(fieldProps);
  }

  const value = getValue(fieldProps);
  const validated = fieldProps.get('validated');
  const expected = fieldProps.get('expected');
  const valid = !!value && validated && expected;
  const invalid = validated && !expected;

  return fieldProps
    .set('valid', valid)
    .set('invalid', invalid);
}

/**
 * Resets the validity state (valid/invalid) of the given field.
 * @param {Map} fieldProps
 * @returns {Map}
 */
export function resetValidityState(fieldProps) {
  return fieldProps
    .set('valid', false)
    .set('invalid', false);
}

/**
 * Resets the validation state of the given field.
 * @param {Map} fieldProps
 * @returns {Map}
 */
export function resetValidationState(fieldProps) {
  return fieldProps
    .set('validating', false)
    .set('validated', false)
    .set('validatedSync', false)
    .set('validatedAsync', false)
    .set('validSync', false)
    .set('validAsync', false);
}

/**
 * Resets the given field to its initial state.
 * @param {Map} fieldProps
 * @returns {Map}
 */
export function reset(fieldProps) {
  const initialValue = fieldProps.get('initialValue');
  let nextFieldProps = fieldProps;

  // nextFieldProps = resetValidationState(nextFieldProps);
  // nextFieldProps = resetValidityState(nextFieldProps);
  // nextFieldProps = setValue(nextFieldProps, initialValue);
  // return nextFieldProps.set('expected', true); // TODO Util which would set this?

  return resetValidationState(
    resetValidityState(
      setValue(
        fieldProps.set('expected', true),
        initialValue
      )
    )
  );
}

/**
 * Sets the given field's focus.
 * @param {Map} fieldProps
 * @param {Boolean} isFocused
 * @returns {Map}
 */
export function setFocus(fieldProps, isFocused = true) {
  return fieldProps.set('focused', isFocused);
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
  console.log(validationResult.toJS());
  console.log({ shouldValidate });

  //
  // TODO Handle "both" validation type
  //
  const validPropName = camelize('valid', type.name);
  const validatedPropName = camelize('validated', type.name);

  //
  // TODO Validation result interface may change (hopefully)
  //
  const expected = validationResult.getIn(['propsPatch', 'expected']);

  console.log({ expected });

  const validatedField = fieldProps
    .set('validated', true)
    .set('expected', expected)
    .set(validPropName, expected)
    .set(validatedPropName, true);

  return setValidityState(validatedField, shouldValidate);
}

/**
 * Sets the given error messages to the given field.
 * When no errors are provided, returns field props intact.
 * @param {Map} fieldProps
 * @param {???} errors
 */
export function setErrors(fieldProps, errors = undefined) {
  /* Allow "null" as explicit empty "errors" value */
  return (typeof errors !== undefined)
    ? fieldProps.set('errors', errors)
    : fieldProps;
}
