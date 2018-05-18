import { returnsExpected, reduceResultsWhile } from './reduceWhile'
import createRuleResolverArgs from './createRuleResolverArgs'
import validateSync from './validateSync'
import validateAsync from './validateAsync'

const defaultValidatorsChain = [validateSync, validateAsync]

/**
 * Performs validation of the given field with the given parameters.
 * Returns the validation result.
 */
export default function validate(args) {
  const { chain, force } = args
  const resolverArgs = createRuleResolverArgs(args)
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
