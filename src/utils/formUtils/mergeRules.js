import * as R from 'ramda'

/**
 * Returns form rules based on the provided proprietary rules
 * and the inherited context rules.
 * @param {Object} validationSchema
 * @param {Object} contextRules
 * @returns {Object}
 */
export default function mergeRules(validationSchema, contextRules = {}) {
  if (!validationSchema) {
    return contextRules
  }

  const closestRules = validationSchema || contextRules

  return closestRules.extend
    ? R.mergeDeepRight(closestRules, contextRules)
    : closestRules
}
