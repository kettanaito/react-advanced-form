import compose from 'ramda/src/compose'
import prepend from 'ramda/src/prepend'

const namedRuleResolver = (rule, field) => [
  rule.selector,
  field[rule.selector],
  'rule',
  rule.ruleName,
]

const resolvingPaths = [
  function nameResolver(rule, field) {
    return ['name', field.name, rule.errorType]
  },
  function typeResolver(rule, field) {
    return ['type', field.type, rule.errorType]
  },
  function generalResolver(rule, field) {
    return ['general', rule.errorType]
  },
]

const isNamedRule = (rule) => rule.ruleName
const getStartPos = (rule) => (rule.selector === 'name' ? 0 : 1)
const getRelevantPaths = (startPos) => resolvingPaths.slice(startPos)
const getPathsForRule = (rule) => compose(getRelevantPaths, getStartPos)(rule)

export default function getResolvePaths(rule) {
  const originPaths = getPathsForRule(rule)
  const resolvePaths = isNamedRule(rule)
    ? prepend(namedRuleResolver, originPaths)
    : originPaths

  return [rule, resolvePaths]
}
