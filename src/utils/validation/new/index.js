import createResolverArgs from './createResolverArgs'
import validateSync from './validateSync'
import validateAsync from './validateAsync'
import { reduceWhileExpected } from './reduceWhile'

export const returnsExpected = (validatorResult) => validatorResult.expected

export default function validate(args) {
  const resolverArgs = createResolverArgs(args)

  console.groupCollapsed('validate @ ', args.fieldProps.name)
  console.log({ args })
  console.log('reducing validators...')
  console.log({ resolverArgs })

  const validationResult = reduceWhileExpected([validateSync, validateAsync])(
    resolverArgs,
  )

  console.warn({ validationResult })
  console.groupEnd()

  return validationResult
}
