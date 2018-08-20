/**
 * Resets the props of the provided field.
 * @param {Map} fieldProps
 * @returns {Map}
 */
export default function resetField(getNextValue) {
  return (fieldProps) => {
    /**
     * Get the dynamic property name which represents the
     * field's value (i.e. "checked" for Checkbox).
     */
    const valuePropName = fieldProps.get('valuePropName');
    const nextValue = getNextValue(fieldProps);

    return fieldProps.merge({
      [valuePropName]: nextValue,
      expected: true,
      valid: false,
      invalid: false,
      validating: false,
      validated: false,
      validSync: false,
      validAsync: false,
      validatedSync: false,
      validatedAsync: false
    });
  };
}
