/**
 * Serializes the provided fields into immutable map.
 * @param {Map} fields
 * @param {Function} valueResolver
 * @return {object}
 */
import { Map } from 'immutable';

export default function serializeFields(fields, valueResolver = null) {
  return fields.reduceRight((serialized, fieldProps) => {
    const isCheckbox = (fieldProps.get('type') === 'checkbox');
    const hasEmptyValue = (fieldProps.get('value') === '');

    if (!isCheckbox && hasEmptyValue) return serialized;

    const valuePropName = fieldProps.get('valuePropName');
    const defaultValue = fieldProps.get(valuePropName);
    const value = valueResolver ? valueResolver(fieldProps) : defaultValue;

    return serialized.setIn(fieldProps.get('fieldPath').split('.'), value);
  }, Map());
}
