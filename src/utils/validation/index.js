// @flow
import type { TSeq } from '../creators';
import type { TValidatorArgs } from './getRules';
import type { TValidationResult } from './createValidationResult';

import { createSeq } from '../creators';
import mapToSingleResult from './mapToSingleResult';
import validationTypes from './validationTypes';
import getValidationTypes from './getValidationTypes';
import createValidationResult from './createValidationResult';

export type TValidatorFunc = (args: TValidatorArgs) => TValidationResult;

/**
 * Create a sequence which continues while each of its functions
 * returns "expected" property equal to "true".
 */
export const seq: TSeq<TValidatorFunc, TValidatorArgs, TValidationResult> = createSeq(
  (result: TValidationResult) => result.expected
);

export default function vaidateByType(args): TValidationResult {
  const { types, fieldProps, form } = args;
  const relevantValidationTypes = types
    ? types(validationTypes)
    : getValidationTypes(fieldProps, form);

  /* Treat a field with no necessary validation types as expected */
  if (relevantValidationTypes.length === 0) {
    console.log('no validation types applicable, field is expected!');
    return createValidationResult(true);
  }

  /**
   * Create a validation sequence consisting of validators determined by the
   * necessary validation types ("sync", "async", or both).
   */
  const validatorsSeq = relevantValidationTypes.map(validationType => validationType.validator);

  console.groupCollapsed('validateByType');
  console.log('fieldProps:', fieldProps && fieldProps.toJS());
  console.log('relevantValidationTypes:', relevantValidationTypes);
  console.log('validatorsSeq:', validatorsSeq);
  console.groupEnd();

  const res = mapToSingleResult(
    seq(...validatorsSeq)
  )(args);

  console.warn('validation result:', res);

  return {
    ...res,
    types: relevantValidationTypes
  };
}
