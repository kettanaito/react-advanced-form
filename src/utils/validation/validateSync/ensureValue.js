import errorTypes from '../errorTypes'
import applyRule from '../applyRule'

export default function ensureValue(resolverArgs) {
  return applyRule(
    {
      errorType: errorTypes.missing,
      resolver({ fieldProps }) {
        return !!fieldProps.value
      },
    },
    resolverArgs,
  )
}
