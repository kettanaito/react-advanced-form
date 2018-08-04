import dispatch from '../../dispatch'
import makeCancelable from '../../makeCancelable'
import createValidationResult from '../createValidationResult'
import createRejectedRule from '../createRejectedRule'
import errorTypes from '../errorTypes'

export default async function applyFieldAsyncRule(resolverArgs) {
  const { fieldProps, form } = resolverArgs
  const { value, asyncRule } = fieldProps

  if (!asyncRule || !value) {
    return createValidationResult(true)
  }

  const pendingRequest = makeCancelable(dispatch(asyncRule, resolverArgs))

  /**
   * Set pending async request reference on field props to be able
   * to cancel request upon field value change.
   */
  form.updateFieldsWith(
    fieldProps.set('pendingAsyncValidation', pendingRequest),
  )

  const res = await pendingRequest.itself

  console.log('async validation res:', res)

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
