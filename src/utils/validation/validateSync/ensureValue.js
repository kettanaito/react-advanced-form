import * as recordUtils from '../../recordUtils'
import errorTypes from '../errorTypes'
import applyRule from '../applyRule'

export default function ensureValue() {
  return (resolverArgs) => {
    const rule = {
      errorType: errorTypes.missing,
      resolver: ({ fieldProps }) => !!recordUtils.getValue(fieldProps),
    }

    return applyRule(rule, resolverArgs)
  }
}
