// @flow
import type { TRejectedRule } from '../createRejectedRule'

import * as R from 'ramda'
import ensureLength from '../../ensureLength'

type KeyResolver = (rejectedRule: TRejectedRule, fieldProps: any) => string[]
type ResolverKeyPath = [TRejectedRule, KeyResolver[]]

const namedRuleResolver = (rejectedRule: TRejectedRule, fieldProps) => [
  rejectedRule.selector,
  fieldProps[rejectedRule.selector],
  'rule',
  rejectedRule.ruleName,
]

const commonKeyPathGetters: KeyResolver[] = [
  function nameResolver(rejectedRule: TRejectedRule, fieldProps) {
    return ['name', fieldProps.name, rejectedRule.errorType]
  },
  function typeResolver(rejectedRule: TRejectedRule, fieldProps) {
    return ['type', fieldProps.type, rejectedRule.errorType]
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
 * resolving sequence may start at "name" resolver, or at the "type" one.
 */
const getStartPos = (rejectedRule: TRejectedRule): number => {
  return rejectedRule.selector === 'name' ? 0 : 1
}

/**
 * Returns the list of key getters starting from the given position
 * in the list of common key getters.
 */
const geKeyResolvers = (startPos: number): KeyResolver[] => {
  return commonKeyPathGetters.slice(startPos)
}

const getResolverPaths = (rejectedRule: TRejectedRule) =>
  R.compose(
    ensureLength(4),
    R.when(isNamedRule(rejectedRule), R.prepend(namedRuleResolver)),
    geKeyResolvers,
    getStartPos,
  )(rejectedRule)

export default function getResolvePaths(
  rejectedRule: TRejectedRule,
): ResolverKeyPath[] {
  return [rejectedRule, getResolverPaths(rejectedRule)]
}
