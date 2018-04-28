// @flow
import type { TSeq } from '../creators';
import type { TValidatorArgs } from './getRules';
import type { TRejectedRule } from './createRejectedRule';
import type { TValidationResult } from './createValidationResult';

import { createSeq } from '../creators';
import reduceValidationResults from './reduceValidationResults';
import validateSync from './validateSync';
// import validateAsync from './validateAsync';

export type TValidatorFunc = (args: TValidatorArgs) => TValidationResult;

/**
 * Create a sequence which continues while each of its functions
 * returns "expected" property equal to "true".
 */
export const seq: TSeq<TValidatorFunc, TValidatorArgs, TValidationResult> = createSeq(
  (result: TValidationResult) => result.expected

  // (results: TValidationResult[]) => {
  //   console.log('seq predicate results:', results);
  //   return results.every(result => result.expected);
  // }
);

const validateFunc = reduceValidationResults(
  seq(
    validateSync,
    // validateAsync
  )
);

export default validateFunc;
