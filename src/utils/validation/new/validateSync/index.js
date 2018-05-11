import * as R from 'ramda'
import { reduceWhileExpected } from '../reduceWhile'
import mapToSingleResult from '../mapToSingleResult'
import shouldValidateSync from './shouldValidateSync'
import applyFieldRule from './applyFieldRule'
import applyFormRules from './applyFormRules'

export default function validateSync(resolverArgs) {
  const needsValidation = () => shouldValidateSync(resolverArgs)

  const validator = R.when(
    needsValidation,
    mapToSingleResult(
      'validateSync',
      reduceWhileExpected([applyFieldRule, applyFormRules]),
    ),
  )

  const result = validator(resolverArgs)
  console.warn('validateSync result:', result)

  return result
}
