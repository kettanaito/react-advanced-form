import * as R from 'ramda'
import dispatch from '../../dispatch'
import makeCancelable from '../../makeCancelable'
import createValidationResult from '../createValidationResult'
import createRejectedRule from '../createRejectedRule'
import errorTypes from '../errorTypes'

export default async function applyFieldAsyncRule(resolverArgs) {
  const { fieldProps, form } = resolverArgs
  const { asyncRule } = fieldProps

  const pendingRequest = makeCancelable(dispatch(asyncRule, resolverArgs))

  /**
   * Set pending async request reference on field props to be able
   * to cancel request upon field value change.
   */
  form.updateFieldsWith(
    R.assoc('pendingAsyncValidation', pendingRequest, fieldProps),
  )

  const result = await pendingRequest.itself

  const { valid, ...extra } = result
  const rejectedRules = valid
    ? undefined
    : createRejectedRule({
        selector: 'name',
        name: 'async',
        errorType: errorTypes.invalid,
      })

  return createValidationResult(valid, rejectedRules, extra)
}
