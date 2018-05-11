import * as R from 'ramda'
import { returnsExpected, reduceResultsWhile } from '../reduceWhile'
import mapToSingleResult from '../mapToSingleResult'
import shouldValidateSync from './shouldValidateSync'
import applyFieldRule from './applyFieldRule'
import applyFormRules from './applyFormRules'

export default function validateSync(resolverArgs) {
  const needsValidation = () => shouldValidateSync(resolverArgs)

  const validator = R.when(
    needsValidation,
    reduceResultsWhile(returnsExpected, [applyFieldRule, applyFormRules]),
  )

  const result = validator(resolverArgs)
  console.warn('validateSync result:', result)

  return result
}
