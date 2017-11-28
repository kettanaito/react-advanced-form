/**
 * Serializes the provided Map of fields.
 * @param {Map} fields
 * @return {object}
 */
import { Map } from 'immutable';

export default function serializeFields(fields) {
  return fields.reduceRight((serialized, fieldProps) => {
    if (fieldProps.get('value') === '') return serialized;

    return serialized.setIn(fieldProps.get('fieldPath').split('.'), fieldProps.get('value'));
  }, Map());
}
