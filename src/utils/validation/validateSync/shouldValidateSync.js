import allPass from 'ramda/src/allPass'
import anyPass from 'ramda/src/anyPass'
import * as recordUtils from '../../recordUtils'

const isForced = (resolverArgs, rules, force) => {
  console.log('shouldValidate, isForced?', force)
  return force
}

const hasValue = ({ fieldProps }) => {
  console.log('shouldValidate, has value?', !!recordUtils.getValue(fieldProps))
  return !!recordUtils.getValue(fieldProps)
}

const notValidatedSync = ({ fieldProps }) => {
  console.log('shouldValidate, not valid already?', !fieldProps.validatedSync)
  return !fieldProps.validatedSync
}

const isRequiredField = ({ fieldProps }) => {
  console.log('shouldValidate, is required?', fieldProps.required)
  return fieldProps.required
}

const hasFieldRule = ({ fieldProps }) => {
  console.log('shouldValidate, has field rule?', !!fieldProps.rule)
  return !!fieldProps.rule
}

const hasFormRules = (resolverArgs, rules) => {
  console.log(
    'shouldValidate, has form rules?',
    rules && (rules.type || rules.name),
  )
  return rules && (rules.type || rules.name)
}

/**
 * Determines the necessity of the synchronous validation.
 */
export default anyPass([
  isForced,
  isRequiredField,
  allPass([notValidatedSync, hasValue, anyPass([hasFieldRule, hasFormRules])]),
])
