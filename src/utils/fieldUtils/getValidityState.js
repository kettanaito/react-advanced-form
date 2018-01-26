/**
 * Returns the next state of the field's validity.
 * Field cannot rely on "valid" prop alone. Consider this:
 * - valid when it has value, has been validated and is indeed valid
 * - invalid - when it has been validated, but it's not valid
 * @param {object} fieldProps
 */
import { Map } from 'immutable';

export default function getValidityState(fieldProps) {
  const value = fieldProps.get('value');
  const expected = fieldProps.get('expected');
  const validatedSync = fieldProps.get('validatedSync');
  const validatedAsync = fieldProps.get('validatedAsync');
  const validated = validatedAsync || validatedSync;

  const validityState = Map({
    valid: !!value && validated && expected,
    invalid: validated && !expected
  });

  return validityState;
}
