import * as R from 'ramda'
import dispatch from '../dispatch'
import errorTypes from './errorTypes'
import createRejectedRule from './createRejectedRule'
import createValidationResult from './createValidationResult'

/**
 * Executes the given resolver function with the given arguments
 * and returns the validation result.
 */
const applyRule = R.curry((rule, resolverArgs) => {
  const { name, selector, resolver, errorType } = rule
  const nextExpected = dispatch(resolver, resolverArgs)

  /* Create rejected rules */
  const rejectedRules = nextExpected
    ? undefined
    : createRejectedRule({
        name,
        selector,
        errorType: errorType || errorTypes.invalid,
      })

  return createValidationResult(nextExpected, rejectedRules)
})

export default applyRule
