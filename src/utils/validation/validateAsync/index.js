import createValidatorResult from '../createValidatorResult'
import shouldValidateAsync from './shouldValidateAsync'
import applyFieldAsyncRule from './applyFieldAsyncRule'

export default async function validateAsync(resolverArgs, rules, force) {
  const result = shouldValidateAsync(resolverArgs, force)
    ? await applyFieldAsyncRule(resolverArgs, force)
    : null

  return createValidatorResult('async', result)
}
