import errorTypes from '../errorTypes'
import applyRule from '../applyRule'

export default function ensureValue(resolverArgs) {
  const rule = {
    errorType: errorTypes.missing,
    resolver: ({ fieldProps }) => !!fieldProps.value,
  }

  return applyRule(rule, resolverArgs)
}
