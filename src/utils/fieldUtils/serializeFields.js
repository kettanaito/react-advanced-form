import flattenDeep from '../flattenDeep'
import * as recordUtils from '../recordUtils'

const predicate = (fieldProps) => {
  console.log('   serialize: predicate')
  console.log('   fieldProps:', fieldProps)

  if (!fieldProps.fieldPath) {
    return
  }

  /* Bypass the fields which should be skipped */
  if (fieldProps.skip) {
    console.log('   should be skipped, skipping...')
    return false
  }

  /* Grab the field's value */
  const value = recordUtils.getValue(fieldProps)

  /* Bypass checkboxes with no value */
  const isCheckbox = fieldProps.type === 'checkbox'
  const hasEmptyValue = value === ''

  if (!isCheckbox && hasEmptyValue) {
    console.log('  is not a checkbox and has empty value')
    return false
  }

  console.log('   satisfies predicate', fieldProps)

  return true
}

/**
 * Serializes the provided fields. Returns
 * @param {Map} fields
 * @param {Object} options
 * @param {Function} transformValue
 * @returns {Map}
 */
export default function serializeFields(fields, transformValue = recordUtils.getValue) {
  console.warn('serialize')
  console.log('should serialize:', fields)
  return flattenDeep(fields, predicate, false, transformValue)
}
