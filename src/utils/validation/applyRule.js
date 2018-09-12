import dispatch from '../dispatch'
import errorTypes from './errorTypes'
import createRejectedRule from './createRejectedRule'
import createValidationResult from './createValidationResult'

/**
 * Executes the given resolver function with the given arguments
 * and returns the validation result.
 */
export default function applyRule(rule, resolverArgs) {
  const { name, selector, resolver, errorType } = rule
  const isFieldExpected = dispatch(resolver, resolverArgs)

  /* Create rejected rules */
  const rejectedRules = isFieldExpected
    ? undefined
    : createRejectedRule({
        errorType: errorType || errorTypes.invalid,
        ruleName: name,
        selector,
      })

  return createValidationResult(isFieldExpected, rejectedRules)
}
