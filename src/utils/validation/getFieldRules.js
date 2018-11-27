import * as R from 'ramda'
import { getRulesPaths } from '../formUtils/filterSchemaByField'

/**
 * Returns "type" and "name" groups of validation rules
 * relevant to the given field.
 *
 * @returns
 * {
 *  fieldPath: {
 *    type: [ValidationRule],
 *    name: [ValidationRule],
 *  },
 *  type: [ValidationRule],
 *  name: [ValidationRule],
 * }
 */
export default function getFieldRules(fieldProps, applicableRules) {
  const rulesPaths = getRulesPaths(fieldProps)

  return rulesPaths.reduce((acc, ruleKeyPath) => {
    const selector = R.head(ruleKeyPath)

    /** @todo This is weird */
    const keyPath =
      selector === 'fieldGroup'
        ? [selector, ruleKeyPath[ruleKeyPath.length - 2]]
        : [selector]

    const ruleGroups = R.path(ruleKeyPath, applicableRules)
    return ruleGroups ? R.assocPath(keyPath, ruleGroups, acc) : acc
  }, {})
}
