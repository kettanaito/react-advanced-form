import mergeDeepLeft from 'ramda/src/mergeDeepLeft'
// import { fromJS, Map } from 'immutable'

/**
 * Returns the iterable instance of form rules based on the provided proprietary rules
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

  return closestRules.extend
    ? mergeDeepLeft(closestRules, contextRules)
    : closestRules
}
