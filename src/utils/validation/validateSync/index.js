import { when } from 'ramda'
import { returnsExpected, reduceResultsWhile } from '../reduceWhile'
import createValidatorResult from '../createValidatorResult'
import createValidationResult from '../createValidationResult'
import createRejectedRule from '../createRejectedRule'
import errorTypes from '../errorTypes'
import shouldValidateSync from './shouldValidateSync'
import checkEmptyRequired from './checkEmptyRequired'
import applyFieldRule from './applyFieldRule'
import applyFormRules from './applyFormRules'

export default function validateSync(resolverArgs, force) {
  const needsValidation = () => force || shouldValidateSync(resolverArgs)

  const { fieldProps } = resolverArgs
  const { value, required } = fieldProps

  //
  // TODO Can this logic be the part of "shouldValidateSync"?
  // This means that "force" will skip this logic.
  //
  if (!value && !required) {
    return createValidatorResult('sync', createValidationResult(true))
  }

  const validator = when(
    needsValidation,
    reduceResultsWhile(returnsExpected, [
      checkEmptyRequired,
      applyFieldRule,
      applyFormRules,
    ]),
  )

  //
  // TODO What does "validator" return when "needsValidation" is false?
  //

  const result = validator(resolverArgs)
  console.warn('validateSync result:', result)

  return createValidatorResult('sync', result)
}
