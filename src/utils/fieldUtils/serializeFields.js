import { Record } from 'immutable'
import flattenDeep from '../flattenDeep'
import * as recordUtils from '../recordUtils'

function predicate(fieldRecord) {
  if (!Record.isRecord(fieldRecord) || !fieldRecord.fieldPath) {
    return
  }

  /* Bypass the fields which should be skipped */
  if (fieldRecord.skip) {
    return false
  }

  /* Grab the field's value */
  const defaultValue = recordUtils.getValue(fieldRecord)

  /* Bypass checkboxes with no value */
  const isCheckbox = fieldRecord.type === 'checkbox'
  const hasEmptyValue = defaultValue === ''
  if (!isCheckbox && hasEmptyValue) {
    return false
  }

  return true
}

/**
 * Serializes the provided fields into immutable map.
 * @param {Map} fields
 * @param {Function} transformValue
 * @returns {Map}
 */
export default function serializeFields(fields, transformValue = recordUtils.getValue) {
  return flattenDeep(fields, predicate, false, transformValue)
}
