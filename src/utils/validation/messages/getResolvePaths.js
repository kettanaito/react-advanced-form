// @flow
import type { TRejectedRule } from '../createRejectedRule'

import when from 'ramda/src/when'
import compose from 'ramda/src/compose'
import prepend from 'ramda/src/prepend'
import ensureLength from '../../ensureLength'

type TKeyResolver = (rejectedRule: TRejectedRule, field: any) => string[]
type TResolvePath = [TRejectedRule, TKeyResolver[]]

const namedRuleResolver = (rejectedRule: TRejectedRule, field) => [
  rejectedRule.selector,
  field[rejectedRule.selector],
  'rule',
  rejectedRule.ruleName,
]

const commonKeyPathGetters: TKeyResolver[] = [
  function nameResolver(rejectedRule: TRejectedRule, field) {
    return ['name', field.name, rejectedRule.errorType]
  },
  function typeResolver(rejectedRule: TRejectedRule, field) {
    return ['type', field.type, rejectedRule.errorType]
  },
  function generalResolver(rejectedRule: TRejectedRule) {
    return ['general', rejectedRule.errorType]
  },
]

const isNamedRule = (rejectedRule: TRejectedRule) => {
  return () => !!rejectedRule.ruleName
}

/**
 * Returns the starting position of the key getters relevant
 * to the given rejected rule. Depending on the rule's selector,
 * resolving sequence may start at "name" resolver, or the "type" one.
 */
const getStartPos = (rejectedRule: TRejectedRule): number => {
  return rejectedRule.selector === 'name' ? 0 : 1
}

/**
 * Returns the list of key getters starting from the given position
 * in the list of common key getters.
 */
const getKeyResolvers = (startPos: number): TKeyResolver[] => {
  return commonKeyPathGetters.slice(startPos)
}

const getPathsForRule = (rejectedRule: TRejectedRule) => {
  return compose(
    ensureLength(4),
    when(isNamedRule(rejectedRule), prepend(namedRuleResolver)),
    getKeyResolvers,
    getStartPos,
  )(rejectedRule)
}

export default function getResolvePaths(
  rejectedRule: TRejectedRule,
): TResolvePath[] {
  return [rejectedRule, getPathsForRule(rejectedRule)]
}
