import { reduceWhileExpected } from '../reduceWhile'
import createRuleResolverArgs from './createRuleResolverArgs'
import validateSync from './validateSync'
// import validateAsync from './validateAsync'

const defaultValidatorsSeq = [validateSync]

/**
 * Performs validation of the given field with the given parameters.
 * Returns the validation result.
 */
export default async function validate(args) {
  const { force, chain } = args
  const resolverArgs = createRuleResolverArgs(args)
  const validatorsSeq = chain || defaultValidatorsSeq

  const validationResult = await reduceWhileExpected(validatorsSeq)(
    resolverArgs,
    force,
  )

  return validationResult
}
