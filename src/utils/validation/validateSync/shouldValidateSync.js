import { allPass, anyPass } from 'ramda'

const isForced = (resolverArgs, rules, force) => force
const hasValue = ({ fieldProps }) => !!fieldProps[fieldProps.valuePropName]
const notValidated = ({ fieldProps }) => !fieldProps.validSync
const isRequiredField = ({ fieldProps }) => fieldProps.required
const hasFieldRule = ({ fieldProps }) => fieldProps.rule
const hasFormRules = (resolverArgs, rules) =>
  rules && (rules.type || rules.name)

export default anyPass([
  isForced,
  isRequiredField,
  allPass([notValidated, hasValue, hasFieldRule]),
  allPass([notValidated, hasValue, hasFormRules]),
])
