/**
 * Resets the given field.
 * @param {Map} fieldProps
 * @return {Map}
 */
export default function resetField(fieldProps) {
  const resetPatch = {
    validSync: false,
    validAsync: false,
    validatedSync: false,
    validatedAsync: false
  };

  const initialValue = fieldProps.get('initialValue');

  switch (fieldProps.get('type')) {
    case 'radio':
    case 'checkbox':
      resetPatch.checked = initialValue;
      break;

    default:
      resetPatch.value = initialValue;
      break;
  }

  return fieldProps.merge(resetPatch);
}
