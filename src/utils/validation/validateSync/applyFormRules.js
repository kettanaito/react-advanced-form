import ifElse from 'ramda/src/ifElse'
import { always, returnsExpected, reduceResultsWhile } from '../reduceWhile'
import getFieldRules from '../getFieldRules'
import createValidationResult from '../createValidationResult'
import applyRule from '../applyRule'

/**
 * Reduces the array of rules declarations into the array
 * of functions that return their respective resolver.
 */
function reduceRules(rules) {
  return reduceResultsWhile(
    always,
    rules.map((rule) => {
      return (args) => applyRule(rule, args)
    }),
  )
}

export default function applyFormRules(resolverArgs) {
  console.log('applyFormRules', { resolverArgs })
  console.groupCollapsed(
    `applyFormRules @ ${resolverArgs.fieldProps.displayFieldPath}`,
  )
  console.log({ resolverArgs })

  const { fieldProps, form } = resolverArgs
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
  )(resolverArgs)

  console.warn('applyFormRules result:', result)
  console.groupEnd()

  return result
}
