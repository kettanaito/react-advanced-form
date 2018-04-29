// @flow
import type { TSeq } from '../creators';
import type { TValidatorArgs } from './getRules';
import type { TValidationResult } from './createValidationResult';
import type { TValidationType } from './shouldValidate';

import mapToSingleResult from './mapToSingleResult';
import validateSync from './validateSync';
import validateAsync from './validateAsync';
import { createSeq } from '../creators';
import createValidationResult from './createValidationResult';

export type TValidatorFunc = (args: TValidatorArgs) => TValidationResult;

/**
 * Create a sequence which continues while each of its functions
 * returns "expected" property equal to "true".
 */
export const seq: TSeq<TValidatorFunc, TValidatorArgs, TValidationResult> = createSeq(
  (result: TValidationResult) => result.expected
);

const validatorsCollection = {
  sync: validateSync,
  async: validateAsync
};

// make it accept validation type as an argument!!!
export default function vaidateByType(args): TValidationResult {
  const { types, fieldProps } = args;

  /**
   * Create a validation sequence consisting of validators determined by the
   * necessary validation types ("sync", "async", or both).
   */
  const validatorsSeq = types.reduce((validators, validationType: TValidationType) => {
    const validatorFunc = validatorsCollection[validationType];
    return validatorFunc ? validators.concat(validatorFunc) : validators;
  }, []);

  /* Treat a field with no necessary validation types as expected */
  if (validatorsSeq.length === 0) {
    return createValidationResult(true);
  }

  console.groupCollapsed('validateByType', types);
  console.log('fieldProps:', fieldProps && fieldProps.toJS());
  console.log('validatorsSeq:', validatorsSeq);
  console.groupEnd();

  return mapToSingleResult(
    seq(...validatorsSeq)
  )(args);
}

// export mapToSingleResult(
//   seq(
//     validateSync,
//     // validateAsync
//   )
// );
