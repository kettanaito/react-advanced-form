import * as R from 'ramda'
import listOf from '../../listOf'
import addWhen from '../../addWhen'
import isset from '../../isset'
import { reduceWhileExpected } from '../../reduceWhile'
import getFieldRules from '../getFieldRules'
import createValidatorResult from '../createValidatorResult'
import shouldValidateSync from './shouldValidateSync'
import ensureValue from './ensureValue'
import applyFieldRule from './applyFieldRule'
import applyFormRules from './applyFormRules'

const hasFormRules = R.allPass([R.complement(R.isNil), R.keys])

const _hasFormRules = (rules) => {
  return rules && Object.keys(rules).length > 0
}

export default async function validateSync(resolverArgs, force) {
  const { fieldProps, form } = resolverArgs
  const { applicableRules } = form.state
  const relevantFormRules = getFieldRules(fieldProps, applicableRules)

  //
  // TODO Deal with data management between getRulesSeq and shoulValidate.
  // No need to overfetch, reuse data.
  //
  const should = shouldValidateSync(resolverArgs, relevantFormRules, force)

  const rulesList = listOf(
    addWhen(fieldProps.required, (required) => required, ensureValue),
    addWhen(fieldProps.rule, isset, applyFieldRule),
    addWhen(relevantFormRules, hasFormRules, applyFormRules),
  )(resolverArgs)

  const result =
    should && rulesList.length > 0
      ? await reduceWhileExpected(rulesList)(resolverArgs)
      : null

  return createValidatorResult('sync', result)
}
