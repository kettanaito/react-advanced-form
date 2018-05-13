import { ifElse } from 'ramda'
import createValidationResult from '../createValidationResult'
import createValidatorResult from '../createValidatorResult'
import shouldValidateAsync from './shouldValidateAsync'
import applyFieldAsyncRule from './applyFieldAsyncRule'

export default function validateAsync(resolverArgs, force) {
  console.groupCollapsed('validateAsync', resolverArgs.fieldProps.name)
  console.log({ resolverArgs })

  const result = ifElse(shouldValidateAsync, applyFieldAsyncRule, () =>
    createValidationResult(true),
  )(resolverArgs, force)

  console.warn('result:', result)

  return createValidatorResult('async', result)
}
