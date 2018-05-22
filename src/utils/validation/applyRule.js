import errorTypes from './errorTypes'
import applyResolver from './applyResolver'
import createRejectedRule from './createRejectedRule'
import createValidationResult from './createValidationResult'

/**
 * Executes the given resolver function with the given arguments
 * and returns the validation result.
 */
export default function applyRule(rule, resolverArgs) {
  const { name, selector, resolver, errorType } = rule
  const expected = applyResolver(resolver, resolverArgs)

  /* Create rejected rules */
  const rejectedRules = expected
    ? undefined
    : createRejectedRule({
        errorType: errorType || errorTypes.invalid,
        ruleName: name,
        selector,
      })

  return createValidationResult(expected, rejectedRules)
}
