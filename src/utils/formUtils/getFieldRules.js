import flattenDeep from '../flattenDeep';

/**
 * Collection of rule selectors listed in the strict order.
 * The selectors reference to the respective field selectors in the
 * validation rules schema.
 */
export const ruleSelectors = [
  fieldProps => ['name', fieldProps.get('name')],
  fieldProps => ['type', fieldProps.get('type')]
];

function defaultRuleTransformer(rule) {
  return rule;
}

function generateValueTransformer(ruleFormatter) {
  return (value, ruleKeyPath) => {
    const selector = ruleKeyPath[0];

    if (typeof value === 'function') {
      const formattedRule = ruleFormatter({
        selector,
        resolver: value,
        ruleKeyPath
      });

      return [formattedRule];
    }

    return value.reduce((list, resolver, name) => {
      const formattedRule = ruleFormatter({
        name,
        selector,
        resolver,
        ruleKeyPath: [...ruleKeyPath, name]
      });

      return list.concat(formattedRule);
    }, []);
  };
}

/**
 * Generates a predicate function based on the provided field props.
 * @param {Map} fieldProps
 * @returns {Function}
 */
function generatePredicate(fieldProps) {
  return (value, deepKeyPath) => {
    return ruleSelectors.some((ruleSelector) => {
      const ruleKeyPath = ruleSelector(fieldProps);
      return ruleKeyPath.every((key, index) => (deepKeyPath[index] === key));
    });
  };
}

/**
 * Returns flattened Map of formatted rules applicable to the provided field.
 * Accepts optional transformation parameters to format the keys/values of the rules.
 */
export default function getFieldRules({
  fieldProps,
  schema,
  flattenKeys = true,
  transformRule = null,
  transformKey = null
}) {
  const ruleTransformer = transformRule || defaultRuleTransformer;

  return flattenDeep(
    schema,
    generatePredicate(fieldProps),
    flattenKeys,
    generateValueTransformer(ruleTransformer),
    transformKey
  );
}
