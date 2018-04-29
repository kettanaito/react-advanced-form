// @flow
import type { TRejectedRule } from './createRejectedRule';

export type TValidationType = 'sync' | 'async' | 'both';
export type TValidationResultExtra = Object;
export type TValidationResult = {
  // type: TValidationType,
  expected: boolean,
  rejectedRules?: TRejectedRule[],
  extra?: TValidationResultExtra
};

/**
 * Returns the unified entity of the validation result.
 * Includes the indicator whether the field's value is expected,
 * the list of rejected validation rules, and any extra params
 * propagated by the validator function.
 */
export default function createValidationResult(
  // type: TValidationType,
  expected: boolean,
  rejectedRules?: TRejectedRule[] | TRejectedRule = [],
  extra?: TValidationResultExtra
): TValidationResult {
  return {
    // type,
    expected,
    rejectedRules: Array.isArray(rejectedRules) ? rejectedRules : [rejectedRules],
    extra
  };
}
