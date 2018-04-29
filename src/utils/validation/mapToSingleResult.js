// @flow
import type { TValidatorFunc } from './index';
import type { TValidationResult } from './createValidationResult';
import type { TValidatorArgs } from './getRules';

function reduceValidationResults(initialAcc: TValidationResult, results: TValidationResult[]) {
  return results.reduce((acc: TValidationResult, result: TValidationResult) => {
    acc.expected = acc.expected ? result.expected : acc.expected;
    acc.rejectedRules = acc.rejectedRules.concat(result.rejectedRules);
    return acc;
  }, initialAcc);
}

export default function mapToSingleResult(...validators: TValidatorFunc[]) {
  return (args: TValidatorArgs) => {
    return validators.reduce((acc, validator: TValidatorFunc) => {
      const validatorResult = validator(args);
      const validatorResultArr = Array.isArray(validatorResult) ? validatorResult : [validatorResult];
      const nextAcc = reduceValidationResults(acc, validatorResultArr);

      return nextAcc;
    }, {
      expected: true,
      rejectedRules: []
    });
  };
}
