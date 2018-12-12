import * as R from 'ramda'

/**
 * Returns form rules based on the provided proprietary rules
 * and the inherited context rules.
 * @param {Object} formRules
 * @param {Object} contextRules
 * @returns {Object}
 */
export default function mergeRules(formRules, contextRules = {}) {
  if (!formRules) {
    return contextRules
  }

  const closestRules = formRules || contextRules

  return closestRules.extend && contextRules
    ? R.mergeDeepRight(contextRules, closestRules)
    : closestRules
}
