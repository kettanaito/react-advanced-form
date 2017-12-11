/**
 * Serializes the provided Map of fields.
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

    const defaultValue = isCheckbox ? fieldProps.get('checked') : fieldProps.get('value');
    const value = valueResolver ? valueResolver(fieldProps) : defaultValue;

    return serialized.setIn(fieldProps.get('fieldPath').split('.'), value);
  }, Map());
}
