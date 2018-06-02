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

  console.log('validated!')
  console.log({ validationResult })

  const updateFieldRecord = when(wasValidated, () =>
    reflectValidation(resolverArgs, validationResult),
  )
  const nextFieldRecord = updateFieldRecord(fieldProps)

  console.log('nextFieldRecord', nextFieldRecord)
  console.warn('nextFieldRecord:', nextFieldRecord && nextFieldRecord.toJS())
  console.groupEnd()

  return nextFieldRecord
}
