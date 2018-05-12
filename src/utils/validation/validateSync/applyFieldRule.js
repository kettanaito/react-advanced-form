import errorTypes from '../errorTypes'
import applyResolver from '../applyResolver'
import createValidationResult from '../createValidationResult'
import createRejectedRule from '../createRejectedRule'

export default function applyFieldRule(resolverArgs) {
  const { value, fieldProps } = resolverArgs
  const { rule } = fieldProps

  if (!rule) {
    return createValidationResult(true)
  }

  const expected =
    typeof rule === 'function'
      ? applyResolver(rule, resolverArgs)
      : rule.test(value)

  const rejectedRule = expected
    ? undefined
    : createRejectedRule({
        name: errorTypes.invalid,
      })

  return createValidationResult(expected, rejectedRule)
}
