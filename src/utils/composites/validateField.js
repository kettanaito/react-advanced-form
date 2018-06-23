import validate from '../validation'
import reflectValidation from '../validation/reflectors/reflectValidation'

/**
 * Composite function that performs the requested validation and
 * reflects its results on the given field record. In case no
 * validation has occurred, field record is returned as is.
 */
export default async function validateField(resolverArgs) {
  console.groupCollapsed(
    `validateField @ ${resolverArgs.fieldProps.displayFieldPath} @ ${
      resolverArgs.__SOURCE__
    }`,
  )
  console.groupCollapsed('resolver args')
  console.log('resolverArgs:', resolverArgs)
  console.log('fieldProps:', resolverArgs.fieldProps.toJS())
  console.log('fields:', resolverArgs.fields && resolverArgs.fields.toJS())
  console.groupEnd()

  const { fieldProps } = resolverArgs
  const validationResult = await validate(resolverArgs)
  const wasValidated = typeof validationResult.expected !== 'undefined'

  console.log('validated!', validationResult)

  if (!wasValidated) {
    console.warn('No validation conducted, bypassing...', fieldProps.toJS())
    return fieldProps
  }

  console.groupEnd()

  return reflectValidation(resolverArgs, validationResult)
}
