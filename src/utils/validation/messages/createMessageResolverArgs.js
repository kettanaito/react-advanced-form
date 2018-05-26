// @flow
import type { TValidationResult } from '../createValidationResult'

export default function createMessageResolverArgs(
  originArgs: Object,
  validationResult: TValidationResult,
) {
  return {
    ...validationResult.extra,
    ...originArgs,
  }
}
