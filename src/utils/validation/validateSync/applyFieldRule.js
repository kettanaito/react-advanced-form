import * as recordUtils from '../../recordUtils'
import applyRule from '../applyRule'

export default function applyFieldRule(fieldRule) {
  return (resolverArgs) => {
    const fieldValue = recordUtils.getValue(resolverArgs.fieldProps)
    const resolver =
      typeof fieldRule === 'function'
        ? fieldRule
        : () => fieldRule.test(fieldValue)

    return applyRule({ resolver }, resolverArgs)
  }
}
