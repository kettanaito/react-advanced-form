/**
 * Serializes the provided fields into immutable map.
 * @param {Map} fields
 * @param {Function} valueResolver
 * @return {object}
 */
import { Map } from 'immutable';

export default function serializeFields(fields, valueResolver = null) {
  return fields.reduceRight((serialized, fieldProps) => {
    /* Bypass the fields with "skip" prop */
    if (fieldProps.get('skip')) return serialized;

    /* Grab the field's value */
    const valuePropName = fieldProps.get('valuePropName');
    const defaultValue = fieldProps.get(valuePropName);

    /* Bypass checkboxes with no value */
    const isCheckbox = (fieldProps.get('type') === 'checkbox');
    const hasEmptyValue = (defaultValue === '');
    if (!isCheckbox && hasEmptyValue) return serialized;

    const value = valueResolver ? valueResolver(fieldProps) : defaultValue;

    return serialized.setIn(fieldProps.get('fieldPath').split('.'), value);
  }, Map());
}
