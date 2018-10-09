import path from 'ramda/src/path'

/**
 * Returns the collection of validation rules of the given selector
 * applicable to the given field.
 */
export const getRulesBySelector = (selector, fieldProps, applicableRules) => {
  const keyPath = [selector, fieldProps[selector]]

  /**
   * @todo Shallow keyed collection is not a usual behavior, but only suitable
   * for the reduced schema into "applicableRules". Consider a unified interface.
   */
  return path(keyPath, applicableRules)
}

/**
 * Returns "type" and "name" groups of validation rules
 * relevant to the given field.
 */
export default function getFieldRules(fieldProps, applicableRules) {
  return ['type', 'name'].reduce((rules, selector) => {
    const rulesGroup = getRulesBySelector(selector, fieldProps, applicableRules)

    if (rulesGroup) {
      rules[selector] = rulesGroup
    }

    return rules
  }, {})
}
