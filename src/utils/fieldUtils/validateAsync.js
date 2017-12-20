/**
 * Asynchronous validation of field.
 * @param {Map} fieldProps
 * @param {Map} fields
 * @param {Object} form
 */
export default async function validateAsync({ fieldProps, fields, form }) {
  /* Bypass validation for an already valid field */
  if (fieldProps.get('validAsync')) return { expected: true };

  const value = fieldProps.get('value');
  const asyncRule = fieldProps.get('asyncRule');

  /* Bypass optional empty fields */
  if (!asyncRule || !value) return { expected: true };

  let expected = false;
  let extra = {};
  const res = await asyncRule({
    value,
    fieldProps: fieldProps.toJS(),
    fields: fields.toJS(),
    form
  });

  if (res) {
    const { valid, ...rest } = res;
    expected = valid;
    extra = rest;
  }

  const validationResult = { expected };

  /* Include additional properties for unexpected fields only */
  if (!expected) validationResult.errorType = 'async';
  if (Object.keys(extra).length > 0) validationResult.extra = extra;

  return validationResult;
}
