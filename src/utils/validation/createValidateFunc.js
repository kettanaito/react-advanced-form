// @flow
import type { TValidatorFunc, TValidationResult } from './index';
import type { TValidatorArgs } from './getRules';

export default function createValidateFunc(...validators: TValidatorFunc[]) {
  return (args: TValidatorArgs) => {
    return validators.reduce((results: TValidationResult[], validator: TValidatorFunc) => {
      const validationResult = validator(args);
      return results.concat(validationResult);
    }, []);
  }
}
