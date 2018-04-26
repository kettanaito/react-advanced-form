// @flow
import type { TValidationResult, TValidationResultExtra } from './index';
import type { TRejectedRule } from './createRejectedRule';

export default function createValidationResult(
  expected: boolean,
  rejectedRules?: TRejectedRule[],
  extra?: TValidationResultExtra
): TValidationResult {
  return {
    expected,
    rejectedRules,
    extra
  };
}
