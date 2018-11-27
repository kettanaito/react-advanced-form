import * as R from 'ramda'
import listOf from '../../listOf'
import addWhen from '../../addWhen'
import isset from '../../isset'
import { reduceResults, reduceWhileExpected } from '../../reduceWhile'
import applyRule from '../applyRule'

/**
 * Reduces the array of rules declarations into the array
 * of functions that return their respective resolvers.
 */
function reduceRules(rules) {
  return reduceResults(
    rules.map((rule) => {
      return (args) => {
        return applyRule(rule, args)
      }
    }),
  )
}

export default function applyFormRules(rules) {
  return (resolverArgs) => {
    const rulesList = listOf(
      /**
       * @todo Remove "listOf" and "addWhen" usage.
       * Accept the list of "rules" that is already filtered,
       * and map it through the "reduceRules" function.
       */
      addWhen(R.path(['fieldGroup', 'name'], rules), isset, reduceRules),
      addWhen(R.path(['fieldGroup', 'type'], rules), isset, reduceRules),
      addWhen(rules.name, isset, reduceRules),
      addWhen(rules.type, isset, reduceRules),
    )(resolverArgs)

    return reduceWhileExpected(rulesList)(resolverArgs)
  }
}
