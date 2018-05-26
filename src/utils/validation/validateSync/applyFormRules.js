import listOf from '../../listOf'
import addWhen from '../../addWhen'
import isset from '../../isset'
import {
  returnsExpected,
  reduceResults,
  reduceResultsWhile,
} from '../../reduceWhile'
import applyRule from '../applyRule'

/**
 * Reduces the array of rules declarations into the array
 * of functions that return their respective resolvers.
 */
function reduceRules(rules) {
  return reduceResults(
    rules.map((rule) => {
      return (args) => applyRule(rule, args)
    }),
  )
}

export default function applyFormRules(rules) {
  return (resolverArgs) => {
    console.groupCollapsed(
      `applyFormRules @ ${resolverArgs.fieldProps.displayFieldPath}`,
    )
    console.log('rules:', rules)
    console.log({ resolverArgs })

    const rulesList = listOf(
      addWhen(rules.name, isset, reduceRules),
      addWhen(rules.type, isset, reduceRules),
    )(resolverArgs)

    const result = reduceResultsWhile(returnsExpected, rulesList)(resolverArgs)

    console.warn('applyFormRules result:', result)
    console.groupEnd()

    return result
  }
}
