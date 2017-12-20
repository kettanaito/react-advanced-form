/**
 * Resets the given field.
 * @param {Map} fieldProps
 * @return {Map}
 */
export default function resetField(fieldProps) {
  const propsPatch = {
    expected: true,
    valid: false,
    invalid: false,
    validSync: false,
    validAsync: false,
    validatedSync: false,
    validatedAsync: false
  };

  const initialValue = fieldProps.get('initialValue');

  /* Different field types need to have different props reset */
  switch (fieldProps.get('type')) {
    case 'checkbox':
      propsPatch.checked = initialValue;
      break;

    default:
      propsPatch.value = initialValue;
      break;
  }

  return fieldProps.merge(propsPatch);
}
