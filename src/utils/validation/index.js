// @flow
import type { TSeq } from '../creators';
import type { TValidatorArgs } from './getRules';
import type { TRejectedRule } from './createRejectedRule';

import { createSeq } from '../creators';
import createValidateFunc from './createValidateFunc';
import validateSync from './validateSync';
// import validateAsync from './validateAsync';

export type TValidationResultExtra = Object;
export type TValidationResult = {
  expected: boolean,
  rejectedRules?: TRejectedRule[],
  extra?: TValidationResultExtra
};

export type TValidatorFunc = (args: TValidatorArgs) => TValidationResult;

/**
 * Create a sequence which continues while each of its functions
 * returns "expected" property equal to "true".
 */
export const seq: TSeq<TValidatorFunc, TValidatorArgs, TValidationResult> = createSeq(
  (results: TValidationResult[]) => results.every(result => result.expected)
);

const validateFunc = createValidateFunc(
  seq(
    validateSync,
    // validateAsync
  )
);

export default validateFunc;
