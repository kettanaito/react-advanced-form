import { fromJS, Map } from 'immutable'

/**
 * Returns the iterable instance of form rules based on the provided proprietary rules
 * and the inherited context rules.
 * @param {Object} formRules
 * @param {Map} contextRules
 * @returns {Map}
 */
export default function mergeRules(formRules, contextRules = Map()) {
  if (!formRules) {
    return contextRules
  }

  const iterableRules = fromJS(formRules)
  const closestRules = iterableRules || contextRules

  return iterableRules.get('extend')
    ? contextRules.mergeDeep(iterableRules)
    : closestRules
}
