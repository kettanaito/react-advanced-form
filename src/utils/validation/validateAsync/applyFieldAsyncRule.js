import dispatch from '../../dispatch'
import makeCancelable from '../../makeCancelable'
import createValidationResult from '../createValidationResult'
import createRejectedRule from '../createRejectedRule'
import errorTypes from '../errorTypes'

export default async function applyFieldAsyncRule(resolverArgs) {
  const { fieldProps, form } = resolverArgs
  const { asyncRule } = fieldProps

  // if (!asyncRule || !value) {
  //   return createValidationResult(true)
  // }

  const pendingRequest = makeCancelable(dispatch(asyncRule, resolverArgs))

  /**
   * Set pending async request reference on field props to be able
   * to cancel request upon field value change.
   */
  form.updateFieldsWith(
    fieldProps.set('pendingAsyncValidation', pendingRequest),
  )

  const result = await pendingRequest.itself

  const { valid, ...extra } = result
  const rejectedRules = valid
    ? undefined
    : createRejectedRule({
        selector: 'name',
        ruleName: 'async',
        errorType: errorTypes.invalid,
      })

  return createValidationResult(valid, rejectedRules, extra)
}
