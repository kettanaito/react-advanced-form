import ifElse from 'ramda/src/ifElse'
import { always, returnsExpected, reduceResultsWhile } from '../reduceWhile'
import getFieldRules from '../getFieldRules'
import createValidationResult from '../createValidationResult'
import applyRule from '../applyRule'

/**
 * Reduces the array of rules into the array of functions
 * that return respective rule's resolver functions.
 */
function reduceRules(rules) {
  return (resolverArgs) => {
    return reduceResultsWhile(
      always,
      rules.map((rule) => {
        return (args) => applyRule(rule, args)
      }),
    )(resolverArgs)
  }
}

export default function applyFormRules(validatorArgs) {
  console.log('applyFormRules', { validatorArgs })
  console.groupCollapsed(
    `applyFormRules @ ${validatorArgs.fieldProps.displayFieldPath}`,
  )
  console.log({ validatorArgs })

  const { fieldProps, form } = validatorArgs
  const { rxRules } = form.state
  const rules = getFieldRules(fieldProps, rxRules)

  console.log({ rules })

  const hasAnyRules = () => rules.name || rules.type

  //
  // TODO Re-write this please.
  //
  const resolversSeq = [rules.name, rules.type].reduce((acc, rulesGroup) => {
    return rulesGroup ? acc.concat(reduceRules(rulesGroup)) : acc
  }, [])

  console.log({ resolversSeq })

  const result = ifElse(
    hasAnyRules,
    reduceResultsWhile(returnsExpected, resolversSeq),
    () => createValidationResult(true),
  )(validatorArgs)

  console.warn('applyFormRules result:', result)
  console.groupEnd()

  return result
}
