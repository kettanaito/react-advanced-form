import mapToSingleResult from '../mapToSingleResult'
import { getRulesBySelector } from '../getFieldRules'
import applyRule from '../applyRule'

export default function applyNameRules(resolverArgs) {
  console.groupCollapsed('applyNameRules @ ', resolverArgs.fieldProps.name)
  console.log({ resolverArgs })

  const { fieldProps, form } = resolverArgs
  const { rxRules } = form.state

  //
  // TODO These rules may be taken by "shouldValidate" function already.
  // Would be great to just pass them here in case already accessed.
  //
  const rules = getRulesBySelector('name', fieldProps, rxRules)
  const result = mapToSingleResult(rules)(resolverArgs)

  console.log({ rules })
  console.log({ result })

  console.groupCollapsed()

  return result
}
