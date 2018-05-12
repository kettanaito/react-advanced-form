import createResolverArgs from './createResolverArgs'
import validateSync from './validateSync'
import validateAsync from './validateAsync'
import { returnsExpected, reduceResultsWhile } from './reduceWhile'

export default function validate(args) {
  const resolverArgs = createResolverArgs(args)

  console.groupCollapsed('validate @ ', args.fieldProps.name)
  console.log({ args })
  console.log('reducing validators...')
  console.log({ resolverArgs })

  const validationResult = reduceResultsWhile(returnsExpected, [
    validateSync,
    validateAsync,
  ])(resolverArgs)

  console.warn({ validationResult })
  console.groupEnd()

  return validationResult
}
