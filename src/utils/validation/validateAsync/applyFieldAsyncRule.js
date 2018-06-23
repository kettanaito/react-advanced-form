import dispatch from '../../dispatch'
import makeCancelable from '../../makeCancelable'
import createValidationResult from '../createValidationResult'
import createRejectedRule from '../createRejectedRule'
import errorTypes from '../errorTypes'

export default async function applyFieldAsyncRule(resolverArgs) {
  const { fieldProps } = resolverArgs
  const { value, asyncRule } = fieldProps

  if (!asyncRule || !value) {
    return createValidationResult(true)
  }

  const pendingValidation = makeCancelable(dispatch(asyncRule, resolverArgs))

  //
  // TODO Propagate "pendingValidation" to the fieldProps to be cancellable onChange.
  //
  const res = await pendingValidation.itself

  const { valid, ...extra } = res
  const rejectedRules = valid
    ? undefined
    : createRejectedRule({
        errorType: errorTypes.invalid,
        ruleName: 'async',
      })

  return createValidationResult(valid, rejectedRules, extra)
}
