import validate from '../validation'
import reflectValidationResult from '../validation/reflectors/reflectValidationResult'

/**
 * Validates the given field and returns the fieldProps with validation reflected.
 */
export default async function validateField(resolverArgs) {
  const { fieldProps } = resolverArgs
  const validationResult = await validate(resolverArgs)
  const wasValidated = validationResult.expected !== null

  if (!wasValidated) {
    return fieldProps
  }

  return reflectValidationResult(resolverArgs)(validationResult)
}
