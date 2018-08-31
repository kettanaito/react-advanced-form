/**
 * Returns the collection of validation rules of the given selector
 * applicable to the given field.
 */
export const getRulesBySelector = (selector, fieldProps, validationSchema) => {
  const keyPath = [selector, fieldProps[selector]]

  //
  // TODO
  // Shallow keyed collection is not a usual behavior, but only suitable
  // for the reduced schema into "validationSchema". Think of the unified interface.
  //
  return validationSchema[keyPath.join('.')]
}

/**
 * Returns "type" and "name" groups of validation rules
 * relevant to the given field.
 */
export default function getFieldRules(fieldProps, validationSchema) {
  return ['type', 'name'].reduce((rules, selector) => {
    const rulesGroup = getRulesBySelector(selector, fieldProps, validationSchema)

    if (rulesGroup) {
      rules[selector] = rulesGroup
    }

    return rules
  }, {})
}
