import allPass from 'ramda/src/allPass'
import anyPass from 'ramda/src/anyPass'
import * as recordUtils from '../../recordUtils'

const isForced = (resolverArgs, rules, force) => {
  return force
}

const hasValue = ({ fieldProps }) => {
  return !!recordUtils.getValue(fieldProps)
}

const notValidatedSync = ({ fieldProps }) => {
  return !fieldProps.validatedSync
}

const isRequiredField = ({ fieldProps }) => {
  return fieldProps.required
}

const hasFieldRule = ({ fieldProps }) => {
  return !!fieldProps.rule
}

const hasFormRules = (resolverArgs, rules) => {
  return rules && (rules.type || rules.name)
}

/**
 * Determines if synchronous validation is necessary.
 */
export default anyPass([
  isForced,
  isRequiredField,
  allPass([notValidatedSync, hasValue, anyPass([hasFieldRule, hasFormRules])]),
])
