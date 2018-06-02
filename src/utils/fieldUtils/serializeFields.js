import { Record } from 'immutable'
import flattenDeep from '../flattenDeep'
import * as recordUtils from '../recordUtils'

function predicate(fieldProps) {
  if (!Record.isRecord(fieldProps) || !fieldProps.fieldPath) {
    return
  }

  /* Bypass the fields which should be skipped */
  if (fieldProps.skip) {
    return false
  }

  /* Grab the field's value */
  const defaultValue = recordUtils.getValue(fieldProps)

  /* Bypass checkboxes with no value */
  const isCheckbox = fieldProps.type === 'checkbox'
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
export default function serializeFields(
  fields,
  transformValue = recordUtils.getValue,
) {
  return flattenDeep(fields, predicate, false, transformValue)
}
