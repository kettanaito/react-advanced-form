/**
 * Determines whether a Field with the provided props should be validated.
 * @param {'both'|'async'|'sync'} type Validation type.
 * @param {Map} fieldProps
 * @param {Map} formRules
 */
import capitalize from '../capitalize';

export default function shouldValidateField({ type, fieldProps, formRules }) {
  const value = fieldProps.get('value');
  const validatedSync = fieldProps.get('validatedSync');
  const required = fieldProps.get('required');

  /* Field with dynamic "required" props is always to validate */
  if (fieldProps.getIn(['dynamicProps', 'required'])) return true;

  /* Bypass the field which was already validated for the given validation type */
  if (fieldProps.get(`validated${capitalize(type)}`)) return false;

  /* Always validate the field with the "rule" or "asyncRule" set */
  if (fieldProps.has('rule') || fieldProps.has('asyncRule')) return true;

  /**
   * All the conditions above apply only in case the validation of the given type
   * has not been already conducted.
   */

  /* Always validate the required field */
  if (required) return true;

  /* Validate optional non-empty field, when name has rules */
  const hasValue = !!value;
  const hasNameRule = formRules.hasIn(['name', fieldProps.get('name')]);
  if (hasValue && hasNameRule) return true;

  /* Validate optional non-empty field, when type has rules */
  const hasTypeRule = formRules.hasIn(['type', fieldProps.get('type')]);
  if (hasValue && hasTypeRule) return true;

  return false;
}
