import * as R from 'ramda'
import flushFieldRefs from '../flushFieldRefs'

/**
 * Iterates over the list of field rules, flushes fields references
 * from each resolver function and adds "refs" property to each rule.
 * @param {Object} resolverArgs
 * @param {Object[]} fieldRules
 * @returns {Object[]}
 */
const getRulesRefs = (resolverArgs, fieldRules) => {
  return R.map((rule) => {
    const { refs } = flushFieldRefs(rule.resolver, resolverArgs)
    return R.assoc('refs', refs, rule)
  })(fieldRules)
}

export default getRulesRefs
