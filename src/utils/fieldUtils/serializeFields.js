import * as R from 'ramda'
import * as recordUtils from '../recordUtils'
import flattenFields from './flattenFields'

const shouldSerializeField = (fieldProps) => {
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
 * @param {Object} fields
 * @returns {Object}
 */
const serializeFields = R.compose(
  R.reduce((acc, fieldProps) => {
    return R.assocPath(fieldProps.fieldPath, recordUtils.getValue(fieldProps), acc)
  }, {}),
  R.filter(shouldSerializeField),
  flattenFields,
)

export default serializeFields
