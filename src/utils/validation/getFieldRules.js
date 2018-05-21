/**
 * Returns the collection of validation rules of the given selector
 * applicable to the given field.
 */
export const getRulesBySelector = (selector, fieldRecord, schema) => {
  console.groupCollapsed(
    `getRulesBySelector "${selector}" for "${fieldRecord.displayFieldPath}"`,
  )

  const keyPath = [selector, fieldRecord.get(selector)]

  console.log('schema:', schema && schema.toJS())
  console.log('keyPath:', keyPath)

  //
  // TODO
  // Shallow keyed collection is not a usual behavior, but only suitable
  // for the reduced schema into "rxRules". Think of the unified interface.
  //
  const rules = schema.get(keyPath.join('.'))

  console.warn('rules:', rules)
  console.groupEnd()

  return rules
}

/**
 * Returns "type" and "name" groups of validation rules
 * relevant to the given field.
 */
export default function getFieldRules(fieldRecord, schema) {
  return ['type', 'name'].reduce((rules, selector) => {
    const rulesGroup = getRulesBySelector(selector, fieldRecord, schema)

    if (rulesGroup) {
      rules[selector] = rulesGroup
    }

    return rules
  }, {})
}
