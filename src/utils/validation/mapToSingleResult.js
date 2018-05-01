// @flow
import type { TValidatorFunc } from './index';
import type { TValidationResult } from './createValidationResult';
import type { TValidatorArgs } from './getRules';

import enforceArray from '../enforceArray';

function reduceValidationResults(initialAcc: TValidationResult, results: TValidationResult[]) {
  return results.reduce((acc: TValidationResult, result: TValidationResult) => {
    const { expected, rejectedRules } = result;
    console.log('reducing result', result);

    acc.expected = acc.expected ? expected : acc.expected;
    acc.rejectedRules = rejectedRules ? acc.rejectedRules.concat(rejectedRules) : acc.rejectedRules;

    console.log('next acc:', acc);
    return acc;
  }, initialAcc);
}

export default function mapToSingleResult(...validators: TValidatorFunc[]) {
  return (args: TValidatorArgs) => {
    console.log('reducing validators', validators);

    return validators.reduce((acc, validator: TValidatorFunc) => {
      console.log('current validator', validator);

      /* Await in case of async validator functions (i.e. validateAsync) */
      const validatorResult = validator(args);
      const validatorResultArr = enforceArray(validatorResult);
      const nextAcc = reduceValidationResults(acc, validatorResultArr);

      console.log('validatorResultArr:', validatorResultArr);
      console.log('nextAcc:', nextAcc);

      return nextAcc;
    }, {
      expected: true,
      rejectedRules: []
    });
  };
}
