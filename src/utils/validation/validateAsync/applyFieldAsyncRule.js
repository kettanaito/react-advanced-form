import * as R from 'ramda'
import dispatch from '../../dispatch'
import makeCancelable from '../../makeCancelable'
import createValidationResult from '../createValidationResult'
import createRejectedRule from '../createRejectedRule'
import errorTypes from '../errorTypes'

export default async function applyFieldAsyncRule(resolverArgs) {
  const {
    fieldProps: { fieldPath, asyncRule },
    form,
  } = resolverArgs
  const pendingRequest = makeCancelable(dispatch(asyncRule, resolverArgs))

  /**
   * Set pending async request reference on field props to be able
   * to cancel request when field's value changes.
   * Applying state patch synchronously, since triggering multiple async
   * validations at the same time is unlikely.
   */
  form.applyStatePatch([
    [
      fieldPath,
      {
        pendingAsyncValidation: pendingRequest,
      },
    ],
  ])

  const response = await pendingRequest.itself

  const { valid, ...extra } = response
  const rejectedRules = valid
    ? undefined
    : createRejectedRule({
        name: 'async',
        selector: 'name',
        errorType: errorTypes.invalid,
      })

  return createValidationResult(valid, rejectedRules, extra)
}
