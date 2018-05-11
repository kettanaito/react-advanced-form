import { reduceWhileExpected } from '../reduceWhile'
import mapToSingleResult from '../mapToSingleResult'
import getFieldRules from '../getFieldRules'
import applyRule from '../applyRule'

function reduceRules(rules) {
  return rules.map((rule) => (resolverArgs) => applyRule(rule, resolverArgs))
}

export default function applyFormRules(resolverArgs) {
  console.groupCollapsed('applyFormRules @ ', resolverArgs.fieldProps.name)
  console.log({ resolverArgs })

  const { fieldProps, form } = resolverArgs
  const { rxRules } = form.state
  const rules = getFieldRules(fieldProps, rxRules)

  console.log({ rules })

  // TODO that doesn't apply rules :/
  const applyNamedRules = (args) =>
    mapToSingleResult('namedRules', reduceRules(rules.name))(args)

  const applyTypeRules = (args) =>
    mapToSingleResult('typeRules', reduceRules(rules.type))(args)

  console.log('reducing the sequence...')

  //
  // TODO Return data type here is messed up. Must be Object.
  //
  const result = mapToSingleResult(
    'applyFormRules',
    reduceWhileExpected([applyNamedRules, applyTypeRules]),
  )(resolverArgs)

  console.warn('applyFormRules result:', result)
  console.groupEnd()

  return result
}
