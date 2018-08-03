import flattenDeep from '../flattenDeep'

/**
 * Collection of rule selectors listed in the strict order.
 * The selectors reference to the respective field selectors in the
 * validation rules schema.
 */
export const ruleSelectors = [
  (fieldProps) => ['name', fieldProps.get('name')],
  (fieldProps) => ['type', fieldProps.get('type')],
]

const defaultRuleTransformer = (rule) => rule

function createValueTransformer(ruleFormatter) {
  return (value, ruleKeyPath) => {
    const selector = ruleKeyPath[0]

    if (typeof value === 'function') {
      const formattedRule = ruleFormatter({
        selector,
        ruleKeyPath,
        resolver: value,
      })

      return [formattedRule]
    }

    return value.reduce((list, resolver, name) => {
      const formattedRule = ruleFormatter({
        name,
        selector,
        resolver,
        ruleKeyPath: [...ruleKeyPath, name],
      })

      return list.concat(formattedRule)
    }, [])
  }
}

/**
 * Generates a predicate function based on the provided field props.
 * @param {Map} fieldProps
 * @returns {Function}
 */
function createPredicate(fieldProps, rxRules) {
  return (value, deepKeyPath) => {
    if (rxRules.has(deepKeyPath.join('.'))) {
      return false
    }

    return ruleSelectors.some((ruleSelector) => {
      const ruleKeyPath = ruleSelector(fieldProps)
      return ruleKeyPath.every((key, index) => deepKeyPath[index] === key)
    })
  }
}

/**
 * Returns flattened Map of formatted rules applicable to the provided field.
 * Accepts optional transformation parameters to format the keys/values of the rules.
 */
export default function getFieldRules({
  fieldProps,
  schema,
  rxRules,
  flattenKeys = true,
  transformRule = null,
  transformKey = null,
}) {
  return flattenDeep(
    schema,
    createPredicate(fieldProps, rxRules),
    flattenKeys,
    createValueTransformer(transformRule || defaultRuleTransformer),
    transformKey,
  )
}
