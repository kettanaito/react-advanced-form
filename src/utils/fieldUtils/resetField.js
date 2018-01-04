/**
 * Resets the given field.
 * @param {Map} fieldProps
 * @return {Map}
 */
export default function resetField(fieldProps) {
  /* Get the dynamic property name which represents the field's value (i.e. "checked" for Checkbox) */
  const valueProp = fieldProps.get('valueProp');
  const initialValue = fieldProps.get('initialValue');

  return fieldProps.merge({
    [valueProp]: initialValue,
    expected: true,
    valid: false,
    invalid: false,
    validSync: false,
    validAsync: false,
    validatedSync: false,
    validatedAsync: false
  });
}
