import when from 'ramda/src/when'
import validate from '../validation'
import reflectValidation from '../validation/reflectors/reflectValidation'

/**
 * Composite function that performs the requested validation and
 * reflects its results on the given field record. In case no
 * validation has occurred, field record is returned as is.
 */
export default function validateField(resolverArgs) {
  console.groupCollapsed(
    `compositeValidate @ ${resolverArgs.fieldProps.displayFieldPath}`,
  )
  console.log({ resolverArgs })

  const { fieldProps } = resolverArgs
  const validationResult = validate(resolverArgs)
  const wasValidated = () => typeof validationResult.expected !== 'undefined'

  console.log('validated!', validationResult)

  const updateFieldProps = when(wasValidated, () =>
    reflectValidation(resolverArgs, validationResult),
  )
  const nextFieldProps = updateFieldProps(fieldProps)

  console.log('nextFieldProps', nextFieldProps)
  console.warn('nextFieldProps:', nextFieldProps && nextFieldProps.toJS())
  console.groupEnd()

  return nextFieldProps
}
