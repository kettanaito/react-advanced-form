import { reduceWhileExpected } from '../reduceWhile'
import createRuleResolverArgs from './createRuleResolverArgs'
import validateSync from './validateSync'
import validateAsync from './validateAsync'

const defaultValidatorsChain = [validateSync, validateAsync]

/**
 * Performs validation of the given field with the given parameters.
 * Returns the validation result.
 */
export default async function validate(args) {
  const { force, chain } = args
  const resolverArgs = createRuleResolverArgs(args)
  const validatorsChain = chain || defaultValidatorsChain

  return reduceWhileExpected(validatorsChain)(resolverArgs, force)
}
