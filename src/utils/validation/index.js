// @flow
import type { TSeq } from '../creators';
import type { TValidatorArgs } from './getRules';
import type { TRejectedRule } from './createRejectedRule';
import type { TValidationResult } from './createValidationResult';

import { createSeq } from '../creators';
import mapToSingleResult from './mapToSingleResult';
import validateSync from './validateSync';
// import validateAsync from './validateAsync';

export type TValidatorFunc = (args: TValidatorArgs) => TValidationResult;

/**
 * Create a sequence which continues while each of its functions
 * returns "expected" property equal to "true".
 */
export const seq: TSeq<TValidatorFunc, TValidatorArgs, TValidationResult> = createSeq(
  (result: TValidationResult) => result.expected
);

export default mapToSingleResult(
  seq(
    validateSync,
    // validateAsync
  )
);
