import { returnsExpected, reduceResultsWhile } from '../../reduceWhile'
import getFieldRules from '../getFieldRules'
import createValidatorResult from '../createValidatorResult'
import shouldValidateSync from './shouldValidateSync'

import listOf from '../../listOf'
import addWhen from '../../addWhen'
import ensureValue from './ensureValue'
import applyFieldRule from './applyFieldRule'
import applyFormRules from './applyFormRules'

export default function validateSync(resolverArgs, force) {
  console.group('validateSync', resolverArgs.fieldProps.displayFieldPath)

  const { fieldProps, form } = resolverArgs
  const { rxRules } = form.state
  const relevantFormRules = getFieldRules(fieldProps, rxRules)

  //
  // TODO Deal with data management between getRulesSeq and shoulValidate.
  // No need to overfetch, reuse data.
  //
  const should = shouldValidateSync(resolverArgs, relevantFormRules, force)

  console.warn('should validate?', should)

  const isRequired = ({ fieldProps }) => fieldProps.required
  const hasFieldRule = ({ fieldProps }) => fieldProps.rule
  const hasFormRules = () => relevantFormRules

  const rulesList = listOf(
    addWhen(isRequired, ensureValue),
    addWhen(hasFieldRule, applyFieldRule),
    addWhen(hasFormRules, applyFormRules),
  )(resolverArgs)

  const result = should
    ? reduceResultsWhile(returnsExpected, rulesList)(resolverArgs)
    : null

  console.warn('validateSync result:', result)
  console.groupEnd()

  return createValidatorResult('sync', result)
}
