import * as recordUtils from '../../recordUtils'
import applyRule from '../applyRule'

export default function applyFieldRule(rule) {
  return (payload) => {
    const { fieldProps } = payload
    const value = recordUtils.getValue(fieldProps)
    const resolver = typeof rule === 'function' ? rule : () => rule.test(value)

    /**
     * Specify the "selector" of the field rule, so when it rejects
     * it attempts to resolve an error message with `['name', fieldName, 'invalid']` key path.
     */
    return applyRule({ selector: 'name', resolver }, payload)
  }
}
