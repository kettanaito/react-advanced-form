import flattenDeep from './flattenDeep';

function defaultTransformValue(fieldProps) {
  return fieldProps.get(fieldProps.get('valuePropName'));
}

/**
 * Serializes the provided fields into immutable map.
 * @param {Map} fields
 * @param {Function} transformValue
 * @returns {Map}
 */
export default function serializeFields(fields, transformValue = defaultTransformValue) {
  const flattenedFields = flattenDeep(fields, (fieldProps) => {
    /* Bypass the fields which should be skipped */
    if (fieldProps.get('skip')) return false;

    /* Grab the field's value */
    const defaultValue = fieldProps.get(fieldProps.get('valuePropName'));

    /* Bypass checkboxes with no value */
    const isCheckbox = (fieldProps.get('type') === 'checkbox');
    const hasEmptyValue = (defaultValue === '');
    if (!isCheckbox && hasEmptyValue) return false;

    return true;
  }, false, transformValue);

  return flattenedFields;
}
