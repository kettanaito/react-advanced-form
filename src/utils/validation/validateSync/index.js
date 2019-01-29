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

/**
 * Accepts form rules relevant to the current field
 * and resolves if those are present.
 */
const hasFormRules = R.allPass([R.complement(R.isNil), R.keys])

export default async function validateSync(resolverArgs, rules, force) {
  const { fieldProps, form } = resolverArgs
  const relevantFormRules = getFieldRules(fieldProps, rules)

  /**
   * @todo Share output between getRulesSeq and shouldValidate.
   * Avoid repeating the logic, prefer reusing the output.
   * Review if this comment is relative.
   */
  const shouldValidate = shouldValidateSync(
    resolverArgs,
    relevantFormRules,
    force,
  )

  /**
   * @todo Rewrite listOf composition to be pure.
   */
  const rulesList = listOf(
    addWhen(fieldProps.required, (required) => required, ensureValue),
    addWhen(fieldProps.rule, isset, applyFieldRule),
    addWhen(relevantFormRules, hasFormRules, applyFormRules),
  )(resolverArgs)

  const syncValidationResult =
    shouldValidate && rulesList.length > 0
      ? await reduceWhileExpected(rulesList)(resolverArgs)
      : null

  return createValidatorResult('sync', syncValidationResult)
}
