// @flow
import type { TRejectedRule } from './createRejectedRule'
import enforceArray from '../enforceArray'

type TExtraParams = {
  [paramName: string]: any,
}

export type TValidationResult = {
  expected: boolean,
  rejectedRules: TRejectedRule[],
  extra?: TExtraParams,
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
  extra: TExtraParams,
): TValidationResult {
  return {
    expected,
    rejectedRules: rejectedRules && enforceArray(rejectedRules),
    extra,
  }
}
