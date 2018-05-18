// @flow
import type { TRejectedRule } from '../createRejectedRule'
import compose from 'ramda/src/compose'
import prepend from 'ramda/src/prepend'

type TKeyPathGetter = (rejectedRule: TRejectedRule, field) => string[]
type TResolvePath = [TRejectedRule, TKeyPathGetter[]]

const namedRuleResolver = (rejectedRule, field) => [
  rejectedRule.selector,
  field[rejectedRule.selector],
  'rule',
  rejectedRule.ruleName,
]

const commonKeyPathGetters: TKeyPathGetter[] = [
  function nameResolver(rejectedRule, field) {
    return ['name', field.name, rejectedRule.errorType]
  },
  function typeResolver(rejectedRule, field) {
    return ['type', field.type, rejectedRule.errorType]
  },
  function generalResolver(rejectedRule, field) {
    return ['general', rejectedRule.errorType]
  },
]

const isNamedRule = (rejectedRule) => rejectedRule.ruleName
const getStartPos = (rejectedRule) => (rejectedRule.selector === 'name' ? 0 : 1)
const getRelevantPaths = (startPos) => commonKeyPathGetters.slice(startPos)
const getPathsForRule = (rejectedRule) =>
  compose(getRelevantPaths, getStartPos)(rejectedRule)

export default function getResolvePaths(
  rejectedRule: TRejectedRule,
): TResolvePath[] {
  const originPaths = getPathsForRule(rejectedRule)
  const keyPathGetters = isNamedRule(rejectedRule)
    ? prepend(namedRuleResolver, originPaths)
    : originPaths

  return [rejectedRule, keyPathGetters]
}
