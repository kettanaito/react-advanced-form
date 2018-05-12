import errorTypes from '../errorTypes'
import applyRule from '../applyRule'

export default function checkEmptyRequired(resolverArgs) {
  return applyRule(
    {
      errorType: errorTypes.missing,
      resolver({ fieldProps: { value, required } }) {
        return required ? !!value : true
      },
    },
    resolverArgs,
  )
}
