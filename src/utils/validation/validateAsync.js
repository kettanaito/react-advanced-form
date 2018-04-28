// import type { TValidationResult } from '.';
// import type { TValidatorArgs } from './getRules';
// import type { ICancelablePromise } from '../makeCancelable';

import errorTypes from './errorTypes';
import createResolverArgs from './createResolverArgs';
import createValidationResult from './createValidationResult';
import createRejectedRule from './createRejectedRule';
import dispatch from '../dispatch';
import makeCancelable from '../makeCancelable';

// type TAsyncValidationRes = {
//   valid: boolean,
//   [extraPropName: string]: any
// };

export default async function validateAsync(args) {
  const { fieldProps, form } = args;

  /**
   * Treat already async valid field as expected.
   * In other words, prevent repetitive async validation over a field
   * which has been already proven valid async. This works because each
   * field change handler resets the validation state of the field.
   */
  if (fieldProps.validAsync) {
    return createValidationResult(true);
  }

  const { valuePropName, asyncRule } = fieldProps;
  const value = fieldProps[valuePropName];

  /* Treat empty field or field without async rule as expected */
  if (!asyncRule || !value) {
    return createValidationResult(true);
  }

  const resolverArgs = createResolverArgs(args);
  const pendingValidation = makeCancelable(
    dispatch(asyncRule, resolverArgs, form.context);
  );

  const res = await pendingValidation.itself;
  const { valid, ...extraProps } = res;

  //
  // TODO Invariant improper response object structure here.
  //

  const rejectedRules = valid ? [] : createRejectedRule({
    name: errorTypes.async,
    isCustom: true
  });

  return createValidationResult(valid, rejectedRules, extraProps);
}
