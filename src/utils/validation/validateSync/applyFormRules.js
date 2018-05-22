import listOf from '../../listOf'
import addWhen from '../../addWhen'
import { always, returnsExpected, reduceResultsWhile } from '../reduceWhile'
import applyRule from '../applyRule'

/**
 * Reduces the array of rules declarations into the array
 * of functions that return their respective resolvers.
 */
function reduceRules(rules) {
  return reduceResultsWhile(
    always,
    rules.map((rule) => {
      return (args) => applyRule(rule, args)
    }),
  )
}

export default function applyFormRules(rules) {
  return (resolverArgs) => {
    console.log('applyFormRules', { resolverArgs })
    console.groupCollapsed(
      `applyFormRules @ ${resolverArgs.fieldProps.displayFieldPath}`,
    )
    console.log({ resolverArgs })

    const hasNameRules = () => rules.name
    const hasTypeRules = () => rules.type

    const rulesList = listOf(
      addWhen(hasNameRules, reduceRules),
      addWhen(hasTypeRules, reduceRules),
    )(resolverArgs)

    const result = reduceResultsWhile(returnsExpected, rulesList)(resolverArgs)

    console.warn('applyFormRules result:', result)
    console.groupEnd()

    return result
  }
}
