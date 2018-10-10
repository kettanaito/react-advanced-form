// @flow
import type { ResolverRecord } from './filterSchemaByField'
import * as R from 'ramda'
import flushFieldRefs from '../flushFieldRefs'

/**
 * Iterates over the list of field rules, flushes fields references
 * from each resolver function and adds "refs" property to each rule.
 */
const getRulesRefs = R.curry(
  (resolverArgs: Object, resolverRecords: ResolverRecord[]): Object[] => {
    return R.map((rule) => {
      const { refs } = flushFieldRefs(rule.resolver, resolverArgs)
      return R.assoc('refs', refs, rule)
    })(resolverRecords)
  },
)

export default getRulesRefs
