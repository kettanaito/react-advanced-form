import ifElse from 'ramda/src/ifElse'
import { always, returnsExpected, reduceResultsWhile } from '../reduceWhile'
import getFieldRules from '../getFieldRules'
import createValidationResult from '../createValidationResult'
import applyRule from '../applyRule'

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
  let foo = []

  if (rules.name) {
    foo = foo.concat(reduceRules(rules.name))
  }

  if (rules.type) {
    foo = foo.concat(reduceRules(rules.type))
  }

  const validator = ifElse(
    hasAnyRules,
    reduceResultsWhile(returnsExpected, foo),
    () => createValidationResult(true),
  )

  const result = validator(validatorArgs)

  console.warn('applyFormRules result:', result)
  console.groupEnd()

  return result
}
