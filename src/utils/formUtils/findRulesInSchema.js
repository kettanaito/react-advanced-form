import * as R from 'ramda'

/**
 * Collection of rule selectors listed in the strict order.
 * The selectors reference to the respective field selectors in the
 * validation rules schema.
 */
export const ruleSelectors = [
  (fieldProps) => ['name', fieldProps.name],
  (fieldProps) => ['type', fieldProps.type],
]

const getFieldRulesPaths = (fieldProps) => [
  ['name', fieldProps.name],
  ['type', fieldProps.type],
]

const createValueTransformer = (formatRule) => {
  return (value, rulePath) => {
    const selector = rulePath[0]

    if (typeof value === 'function') {
      const formattedRule = formatRule(
        {
          selector,
          ruleKeyPath: rulePath,
          resolver: value,
        },
        rulePath,
      )

      return [formattedRule]
    }

    return value.reduce((acc, resolver, name) => {
      const formattedRule = formatRule(
        {
          name,
          selector,
          resolver,
          ruleKeyPath: rulePath.concat(name),
        },
        rulePath,
      )

      return acc.concat(formattedRule)
    }, [])
  }
}

/**
 * Returns flattened Map of formatted rules applicable to the provided field.
 * Accepts optional transformation parameters to format the keys/values of the rules.
 *
 * So, this function accepts the field and all available rules, matches them against
 * the field to get the relevant ones, and then formats relevant rules to be in a
 * unified format (selector/resolver/ruleKeyPath/refs).
 */
export default function findRulesInSchema({
  fieldProps,
  validationSchema,
  transformRule = (rule) => rule,
}) {
  return getFieldRulesPaths(fieldProps).reduce((acc, rulePath) => {
    const foundRule = R.path(rulePath, validationSchema)

    return foundRule
      ? R.assocPath(
          rulePath,
          createValueTransformer(transformRule)(foundRule, rulePath),
          acc,
        )
      : acc
  }, {})
}