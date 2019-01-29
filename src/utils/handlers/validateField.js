import * as R from 'ramda'
import validate from '../validation'
import reflectValidationResult from '../validation/reflectors/reflectValidationResult'

/**
 * Validates the given field and returns the fieldProps with validation reflected.
 */
export default async function validateField(resolverArgs) {
  const { fieldProps } = resolverArgs
  const validationResult = await validate(resolverArgs)

  if (validationResult.expected === null) {
    /**
     * When a field needed no validation, return its state as-is
     * but set "expected" to "true" since its default value is "false",
     * to prevent field from blocking the submit.
     *
     * @todo Maybe all fields should be treated as "expected", since
     * their validation necessity is defined by "validatedABC" props,
     * and will re-write the value of "expected" when needed.
     */
    return R.assoc('expected', true, fieldProps)
  }

  return reflectValidationResult(resolverArgs)(validationResult)
}
