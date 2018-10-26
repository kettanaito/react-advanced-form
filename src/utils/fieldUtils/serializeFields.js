import * as R from 'ramda'
import * as recordUtils from '../recordUtils'
import flattenFields from './flattenFields'

/**
 * @todo
 * Re-write this using functions chain, instead of a single ugly function.
 */
const shouldSerializeField = (fieldProps) => {
  if (!fieldProps.fieldPath) {
    return
  }

  /* Bypass the fields which should be skipped */
  if (fieldProps.skip) {
    return false
  }

  /* Grab the field's value */
  const value = recordUtils.getValue(fieldProps)

  /* Bypass checkboxes with no value */
  const isCheckbox = fieldProps.type === 'checkbox'
  const hasEmptyValue = value === ''

  if (!isCheckbox && hasEmptyValue) {
    return false
  }

  return true
}

/**
 * Serializes the provided fields. Returns
 * @param {Object} fields
 * @returns {Object}
 */
const serializeFields = R.compose(
  R.reduce((acc, fieldProps) => {
    return R.assocPath(
      fieldProps.fieldPath,
      R.compose(
        fieldProps.serialize,
        recordUtils.getValue,
      )(fieldProps),
      acc,
    )
  }, {}),
  R.filter(shouldSerializeField),
  flattenFields,
)

export default serializeFields
