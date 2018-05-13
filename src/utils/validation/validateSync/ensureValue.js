import errorTypes from '../errorTypes'
import applyRule from '../applyRule'

export default function ensureValue(resolverArgs) {
  console.log('ensuring the value...')

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
