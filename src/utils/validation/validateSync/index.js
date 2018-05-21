import ifElse from 'ramda/src/ifElse'
import { returnsExpected, reduceResultsWhile } from '../reduceWhile'
import getFieldRules from '../getFieldRules'
import createValidatorResult from '../createValidatorResult'
import createValidationResult from '../createValidationResult'
import shouldValidateSync from './shouldValidateSync'
import ensureValue from './ensureValue'
import applyFieldRule from './applyFieldRule'
import applyFormRules from './applyFormRules'

/* Synchronous validation rules chain */
const rulesChain = [ensureValue, applyFieldRule, applyFormRules]

export default function validateSync(resolverArgs, force) {
  console.group('validateSync', resolverArgs.fieldProps.displayFieldPath)

  const { fieldProps, form } = resolverArgs
  const { rxRules } = form.state
  const relevantRules = getFieldRules(fieldProps, rxRules)

  console.log('running validators sequence...')
  console.warn(
    'should validate?',
    shouldValidateSync(resolverArgs, relevantRules, force),
  )

  const result = ifElse(
    shouldValidateSync,
    reduceResultsWhile(returnsExpected, rulesChain),
    () => null,
  )(resolverArgs, relevantRules, force)

  console.warn('validateSync result:', result)
  console.groupEnd()

  return createValidatorResult('sync', result)
}
