import createValidatorResult from '../createValidatorResult'
import shouldValidateAsync from './shouldValidateAsync'
import applyFieldAsyncRule from './applyFieldAsyncRule'

export default async function validateAsync(resolverArgs, force) {
  console.log(' ')
  console.groupCollapsed('validateAsync', resolverArgs.fieldProps.name)
  console.log('resolver args:', resolverArgs)

  const result = shouldValidateAsync(resolverArgs, force)
    ? await applyFieldAsyncRule(resolverArgs, force)
    : null

  console.warn('validateAsync result:', result)
  console.groupEnd()
  console.log(' ')

  return createValidatorResult('async', result)
}
