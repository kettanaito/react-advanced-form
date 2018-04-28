// @flow
import type { TRejectedRule } from './createRejectedRule';

export type TValidationResultExtra = Object;
export type TValidationResult = {
  expected: boolean,
  rejectedRules?: TRejectedRule[],
  extra?: TValidationResultExtra
};

/**
 * Returns the unified entity of a validation result.
 * Includes the indicator whether the field's value is expected,
 * the list of rejected validation rules, and any extra params
 * propagated by the validator function.
 */
export default function createValidationResult(
  expected: boolean,
  rejectedRules?: TRejectedRule[] = [],
  extra?: TValidationResultExtra
): TValidationResult {
  return {
    expected,
    rejectedRules: Array.isArray(rejectedRules) ? rejectedRules : [rejectedRules],
    extra
  };
}
