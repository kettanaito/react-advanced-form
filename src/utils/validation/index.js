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
  const { force, chain } = args
  const resolverArgs = createRuleResolverArgs(args)
  const validatorsChain = chain || defaultValidatorsChain

  console.groupCollapsed(`validate @ ${args.fieldProps.displayFieldPath}`)
  console.log('validate args:', args)
  console.log('resolverArgs:', resolverArgs)
  console.log('validators chain:', validatorsChain)
  console.log('reducing validators...')

  const validationResult = reduceResultsWhile(returnsExpected, validatorsChain)(
    resolverArgs,
    force,
  )

  console.warn({ validationResult })
  console.groupEnd()

  return validationResult
}
