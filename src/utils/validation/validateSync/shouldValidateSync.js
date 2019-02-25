import * as R from 'ramda'
import * as recordUtils from '../../recordUtils'

/**
 * Validation may be forced when originated from an external source.
 * For example, a validation request originated from the reactive
 * prop resolver.
 */
const isForced = (resolverArgs, rules, force) => {
  return force
}

const hasValue = ({ fieldProps }) => {
  return !!recordUtils.hasValue(fieldProps)
}

const notValidSync = ({ fieldProps }) => {
  /**
   * @todo This is not correct.
   * These predicates must determine if the validation is necessary.
   * "!fieldProps.validatedSync" is enough: if field has been validated,
   * no need to re-validated it again. Whenever its value changes, "validatedSync"
   * must be reset to "false".
   *
   * This is a quickfix, since now when there is a single validated invalid field,
   * submit results into validation skipping that field (resolves like validation isn't necessary),
   * and form submits with invalid field.
   */
  return !(fieldProps.validatedSync && fieldProps.validSync)
}

const isRequiredField = ({ fieldProps }) => {
  return fieldProps.required
}

const hasFieldRule = ({ fieldProps }) => {
  return !!fieldProps.rule
}

const hasFormRules = (resolverArgs, formRules) => {
  return formRules && (formRules.type || formRules.name)
}

/**
 * Determines if synchronous validation is necessary.
 */
export default R.anyPass([
  isForced,
  isRequiredField,
  R.allPass([notValidSync, hasValue, R.anyPass([hasFieldRule, hasFormRules])]),
])
