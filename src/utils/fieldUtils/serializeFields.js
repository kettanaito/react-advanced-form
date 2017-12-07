/**
 * Serializes the provided Map of fields.
 * @param {Map} fields
 * @return {object}
 */
import { Map } from 'immutable';

export default function serializeFields(fields) {
  return fields.reduceRight((serialized, fieldProps) => {
    const isCheckbox = (fieldProps.get('type') === 'checkbox');
    const hasEmptyValue = (fieldProps.get('value') === '');

    if (!isCheckbox && hasEmptyValue) return serialized;

    const serializedValue = isCheckbox ? fieldProps.get('checked') : fieldProps.get('value');

    return serialized.setIn(fieldProps.get('fieldPath').split('.'), serializedValue);
  }, Map());
}
