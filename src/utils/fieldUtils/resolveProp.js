/**
 * Resolves the given prop name of the field.
 * @param {string} propName
 * @param {object} fieldProps
 * @param {Map} fields
 */
export default function resolveProp({ propName, fieldProps, fields }) {
  const propValue = fieldProps[propName];
  if (typeof propValue !== 'function') return propValue;

  return propValue({ fieldProps, fields: fields.toJS() });
}
