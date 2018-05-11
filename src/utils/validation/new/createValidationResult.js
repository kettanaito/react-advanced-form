import enforceArray from '../../enforceArray'

/**
 * Returns the unified entity of the validation result.
 * Includes the indicator whether the field's value is expected,
 * the list of rejected validation rules, and any extra params
 * propagated by the validator function.
 */
export default function createValidationResult(expected, rejectedRules, extra) {
  return {
    expected,
    rejectedRules: enforceArray(rejectedRules),
    extra,
  }
}
