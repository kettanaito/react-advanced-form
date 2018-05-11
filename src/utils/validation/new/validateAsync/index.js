import * as R from 'ramda'
import createResolverArgs from '../../createResolverArgs'
import applyFieldAsyncRule from './applyFieldAsyncRule'

export default function validateAsync(args) {
  console.groupCollapsed('validateAsync', args.fieldProps.name)
  console.log({ args })

  const needsValidation = () => shouldValidateAsync(args)
  const validator = R.when(needsValidation, applyFieldAsyncRule)
  const resolverArgs = createResolverArgs(args)
  const result = validator(resolverArgs)

  console.warn('result:', result)

  return result
}
