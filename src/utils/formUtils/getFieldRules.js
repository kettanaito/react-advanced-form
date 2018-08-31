import path from 'ramda/src/path'
import equals from 'ramda/src/equals'
import flattenDeep from '../flattenDeep'

/**
 * Collection of rule selectors listed in the strict order.
 * The selectors reference to the respective field selectors in the
 * validation rules schema.
 */
export const ruleSelectors = [
  (fieldProps) => ['name', fieldProps.name],
  (fieldProps) => ['type', fieldProps.type],
]

const defaultRuleTransformer = (rule) => {
  return rule
}

const createValueTransformer = (formatRule) => {
  return (value, ruleKeyPath) => {
    const selector = ruleKeyPath[0]

    if (typeof value === 'function') {
      const formattedRule = formatRule({
        selector,
        ruleKeyPath,
        resolver: value,
      })

      return [formattedRule]
    }

    return value.reduce((list, resolver, name) => {
      const formattedRule = formatRule({
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
 * Returns a predicate function based on the provided field props.
 * @param {Function[]} ruleSelectors
 * @param {Record} fieldProps
 * @returns {Function<boolean>}
 */
const createPredicate = (ruleSelectors, fieldProps, validationSchema) => {
  return (_, keyPath) => {
    // if (validationSchema.hasOwnProperty(keyPath.join('.'))) {
    if (path(keyPath, validationSchema)) {
      return false
    }

    return ruleSelectors.some((ruleSelector) => {
      return equals(keyPath, ruleSelector(fieldProps))
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
  validationSchema,
  transformRule,
}) {
  console.warn('getFieldRules')
  console.log({ schema })
  console.log({ fieldProps })
  console.log({ validationSchema })

  return flattenDeep(
    schema,
    createPredicate(ruleSelectors, fieldProps, validationSchema),
    true,
    createValueTransformer(transformRule || defaultRuleTransformer),
  )
}
