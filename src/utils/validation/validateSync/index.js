import { when } from 'ramda'
import { returnsExpected, reduceResultsWhile } from '../reduceWhile'
import shouldValidateSync from './shouldValidateSync'
import applyFieldRule from './applyFieldRule'
import applyFormRules from './applyFormRules'

export default function validateSync(resolverArgs, force) {
  const needsValidation = () => force || shouldValidateSync(resolverArgs)

  const validator = when(
    needsValidation,
    reduceResultsWhile(returnsExpected, [applyFieldRule, applyFormRules]),
  )

  //
  // TODO What does "validator" return when no validation is needed?
  //

  const result = validator(resolverArgs)
  console.warn('validateSync result:', result)

  return result
}
