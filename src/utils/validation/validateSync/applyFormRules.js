import { always, returnsExpected, reduceResultsWhile } from '../reduceWhile'
import getFieldRules from '../getFieldRules'
import applyRule from '../applyRule'

function reduceRulesGroup(rules) {
  return (resolverArgs) => {
    return reduceResultsWhile(
      always,
      rules.map((rule) => (args) => applyRule(rule, args)),
    )(resolverArgs)
  }
}

export default function applyFormRules(resolverArgs) {
  console.groupCollapsed('applyFormRules @ ', resolverArgs.fieldProps.name)
  console.log({ resolverArgs })

  const { fieldProps, form } = resolverArgs
  const { rxRules } = form.state
  const rules = getFieldRules(fieldProps, rxRules)

  console.log({ rules })

  const result = reduceResultsWhile(returnsExpected, [
    reduceRulesGroup(rules.name),
    reduceRulesGroup(rules.type),
  ])(resolverArgs)

  console.warn('applyFormRules result:', result)
  console.groupEnd()

  return result
}
