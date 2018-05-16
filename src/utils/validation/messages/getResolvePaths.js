import when from 'ramda/src/when'
import compose from 'ramda/src/compose'
import prepend from 'ramda/src/prepend'

const namedRuleResolver = (rule, field) => [
  rule.selector,
  field[rule.selector],
  'rule',
  rule.ruleName,
]

const resolvingPaths = [
  (rule, field) => ['name', field.name, rule.errorType],
  (rule, field) => ['type', field.type, rule.errorType],
  (rule, field) => ['general', rule.errorType],
]

const isNamedRule = (rule) => rule.ruleName
const getStartPos = (rule) => (rule.ruleName ? 0 : 1)
const getRelevantPaths = (startPos) => resolvingPaths.slice(startPos)
const getPathsForRule = (rule) =>
  compose(
    when(isNamedRule, prepend(namedRuleResolver)),
    getRelevantPaths,
    getStartPos,
  )(rule)

export default function getResolvePaths(rule) {
  return [rule, getPathsForRule(rule)]
}
