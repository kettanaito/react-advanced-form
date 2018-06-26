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
  // TODO
  // Instantiate intermediate form state update to propagate the pending promise
  // reference to the field record. This would allow to cancel pending promise
  // on field change.
  //
  const res = await pendingValidation.itself

  const { valid, ...extra } = res
  const rejectedRules = valid
    ? undefined
    : createRejectedRule({
        errorType: errorTypes.invalid,
        ruleName: 'async',
        selector: 'name',
      })

  return createValidationResult(valid, rejectedRules, extra)
}
