import { Map } from 'immutable';

/**
 * Returns the validity state of the provided field based on its props and the necessity of the validation.
 * Note that fields which do not require any validation should return "false" for both "valid" and "invalid"
 * to have their validity state reflected properly in the UI.
 * @param {Map} fieldProps
 * @param {boolean} needsValidation
 * @returns {ValidityState}
 */
export default function getValidityState({ fieldProps, needsValidation }) {
  if (!needsValidation) {
    return Map({ valid: false, invalid: false });
  }

  const value = fieldProps.get(fieldProps.get('valuePropName'));
  const expected = fieldProps.get('expected');
  const validatedSync = fieldProps.get('validatedSync');
  const validatedAsync = fieldProps.get('validatedAsync');
  const validated = validatedAsync || validatedSync;

  return Map({
    valid: !!value && validated && expected,
    invalid: validated && !expected
  });
}
