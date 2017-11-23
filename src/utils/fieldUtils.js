/**
 * Resolves the given prop name of the field.
 * @param {string} propName
 * @param {object} fieldProps
 * @param {Map} fields
 */
export function resolveProp({ propName, fieldProps, fields }) {
  console.groupCollapsed(fieldProps.name, `@ resolveProp "${ propName }"`);
  console.log('fieldProps', fieldProps);

  const propValue = fieldProps[propName];

  if (typeof propValue === 'function') {
    console.log('prop is a function, should resolve...');
    console.log('fields', fields);

    const resolvedPropValue = propValue({ fieldProps, fields: fields.toJS() });

    console.log('resolved prop value:', resolvedPropValue);

    console.groupEnd();

    return resolvedPropValue;
  }

  console.log(`prop "${ propName }" is not a function, return as is:`, propValue);
  console.groupEnd();

  return propValue;
}

/**
 * Determines whether a Field with the provided props should be validated.
 * @param {object} fieldProps
 */
export function shouldValidateField({ fieldProps }) {
  return !fieldProps.validated || (typeof fieldProps.required === 'function');
}
