import createResolverArgs from './createResolverArgs'
import validateSync from './validateSync'
import validateAsync from './validateAsync'
import { returnsExpected, reduceResultsWhile } from './reduceWhile'

const defaultValidatorsChain = [validateSync, validateAsync]

export default function validate(args) {
  const { chain, force } = args
  const resolverArgs = createResolverArgs(args)
  const validatorsChain = chain || defaultValidatorsChain

  console.groupCollapsed(`validate @ ${args.fieldProps.displayFieldPath}`)
  console.log({ args })
  console.log('validators chain:', validatorsChain)
  console.log('reducing validators...')
  console.log({ resolverArgs })

  const validationResult = reduceResultsWhile(returnsExpected, validatorsChain)(
    resolverArgs,
    force,
  )

  console.warn({ validationResult })
  console.groupEnd()

  return validationResult
}
