import errorTypes from './errorTypes'
import applyResolver from './applyResolver'
import createRejectedRule from './createRejectedRule'
import createValidationResult from './createValidationResult'

export default function applyRule(rule, resolverArgs) {
  const { name, selector, resolver } = rule

  /* Execute the resolver function */
  const expected = applyResolver(resolver, resolverArgs)

  /* Create rejected rules */
  const rejectedRules = expected
    ? undefined
    : createRejectedRule({
        name: name || errorTypes.invalid,
        selector,
        isCustom: !!name,
      })

  return createValidationResult(expected, rejectedRules)
}
