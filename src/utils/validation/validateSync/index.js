import listOf from '../../listOf'
import addWhen from '../../addWhen'
import isset from '../../isset'
import { returnsExpected, reduceResultsWhile } from '../../reduceWhile'
import getFieldRules from '../getFieldRules'
import createValidatorResult from '../createValidatorResult'
import shouldValidateSync from './shouldValidateSync'
import ensureValue from './ensureValue'
import applyFieldRule from './applyFieldRule'
import applyFormRules from './applyFormRules'

const hasFormRules = (rules) => rules && Object.keys(rules).length > 0

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

  console.log('relevantFormRules:', relevantFormRules)
  console.warn('should validate?', should)

  const rulesList = listOf(
    addWhen(fieldProps.required, (required) => required, ensureValue),
    addWhen(fieldProps.rule, isset, applyFieldRule),
    addWhen(relevantFormRules, hasFormRules, applyFormRules),
  )(resolverArgs)

  const result =
    should && rulesList.length > 0
      ? reduceResultsWhile(returnsExpected, rulesList)(resolverArgs)
      : null

  console.warn('validateSync result:', result)
  console.groupEnd()

  return createValidatorResult('sync', result)
}
