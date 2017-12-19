/**
 * Determines whether a Field with the provided props should be validated.
 * @param {Map} fieldProps
 * @param {Map} formRules
 */
export default function shouldValidateField({ fieldProps, formRules }) {
  const value = fieldProps.get('value');
  const validatedSync = fieldProps.get('validatedSync');
  const required = fieldProps.get('required');

  /* Field with dynamic "required" props are always to validate */
  const hasDynamicRequired = (typeof required === 'function');
  if (hasDynamicRequired) return true;

  /* Bypass the fields which are already validated sync */
  if (validatedSync) return false;

  /* Always validate required fields */
  if (required) return true;

  /* Validate optional non-empty fields with rules */
  const hasValue = !!value;
  const hasNameRule = formRules.hasIn(['name', fieldProps.get('name')]);

  if (hasValue && hasNameRule) return true;

  const hasTypeRule = formRules.hasIn(['type', fieldProps.get('type')]);
  if (hasValue && hasTypeRule) return true;

  return false;

  return shouldValidate;
}
