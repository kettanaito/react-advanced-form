import { when } from 'ramda'
import shouldValidateAsync from './shouldValidateAsync'
import applyFieldAsyncRule from './applyFieldAsyncRule'

export default function validateAsync(resolverArgs) {
  console.groupCollapsed('validateAsync', resolverArgs.fieldProps.name)
  console.log({ resolverArgs })

  const needsValidation = () => shouldValidateAsync(resolverArgs)
  const validator = when(needsValidation, applyFieldAsyncRule)
  const result = validator(resolverArgs)

  console.warn('result:', result)

  return result
}
