import createValidatorResult from '../createValidatorResult'
import shouldValidateAsync from './shouldValidateAsync'
import applyFieldAsyncRule from './applyFieldAsyncRule'

export default async function validateAsync(resolverArgs, force) {
  const result = shouldValidateAsync(resolverArgs, force)
    ? await applyFieldAsyncRule(resolverArgs, force)
    : null

  // console.log('fieldProps:', resolverArgs.fieldProps.toJS())

  return createValidatorResult('async', result)
}
