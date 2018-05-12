import invariant from 'invariant'
import errorTypes from './errorTypes'
import applyResolver from './applyResolver'
import createRejectedRule from './createRejectedRule'
import createValidationResult from './createValidationResult'

export default function applyRule(rule, resolverArgs) {
  invariant(
    rule && typeof rule === 'object',
    'Failed to apply the rule to `%s` field. Expected the rule to be a rule Object, but got: %s.',
    resolverArgs.fieldProps.displayFieldPath,
    rule,
  )

  const { name, ruleKeyPath, resolver } = rule

  /* Execute the resolver function */
  const expected = applyResolver(resolver, resolverArgs)

  /* Create rejected rules */
  const rejectedRules = expected
    ? undefined
    : createRejectedRule({
        errorType: name || errorTypes.invalid,
        ruleKeyPath,
        isCustom: !!name,
      })

  return createValidationResult(expected, rejectedRules)
}
