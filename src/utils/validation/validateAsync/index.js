import { when } from 'ramda'
import createValidatorResult from '../createValidatorResult'
import shouldValidateAsync from './shouldValidateAsync'
import applyFieldAsyncRule from './applyFieldAsyncRule'

export default function validateAsync(resolverArgs, force) {
  console.groupCollapsed('validateAsync', resolverArgs.fieldProps.name)
  console.log({ resolverArgs })

  const needsValidation = () => force || shouldValidateAsync(resolverArgs)
  const validator = when(needsValidation, applyFieldAsyncRule)
  const result = validator(resolverArgs)

  console.warn('result:', result)

  return createValidatorResult('async', result)
}
