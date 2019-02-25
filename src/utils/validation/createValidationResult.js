// @flow
import type { TRejectedRule } from './createRejectedRule'

type ExtraParams = {
  [paramName: string]: any,
}

export type TValidationResult = {
  expected: boolean,
  rejectedRules: TRejectedRule[],
  extra?: ExtraParams,
}

/**
 * Returns the unified entity of the validation result.
 * Includes the indicator whether the field's value is expected,
 * the list of rejected validation rules, and any extra params
 * propagated by the validator function.
 */
export default function createValidationResult(
  expected: boolean,
  rejectedRules: TRejectedRule[],
  extra: ExtraParams,
): TValidationResult {
  return {
    expected,
    rejectedRules: rejectedRules && [].concat(rejectedRules),
    extra,
  }
}
