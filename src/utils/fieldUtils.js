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

/**
 * Returns whether the field is valid in the given context.
 * Field cannot rely on "valid" prop alone. Consider this:
 * - valid when it has value, has been validated and is indeed valid
 * - invalid - when it has been validated, but it's not valid
 */
export function updateValidState({ name, value, validated, expected }) {
  const validState = {
    valid: !!value && validated && expected,
    invalid: validated && !expected
  };

  console.groupCollapsed(name, '@ updateValidState');
  console.log('value', value);
  console.log('validated', validated);
  console.log('expected', expected);
  console.log('validState', validState);
  console.groupEnd();

  return validState;
}
