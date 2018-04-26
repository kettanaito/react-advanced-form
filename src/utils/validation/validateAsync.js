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

  /* Bypass already async valid fields */
  if (fieldProps.get('validAsync')) {
    return createValidationResult(true);
  }

  const valuePropName: string = fieldProps.get('valuePropName');
  const value = fieldProps.get(valuePropName);
  const asyncRule = fieldProps.get('asyncRule');

  if (!asyncRule || !value) {
    return createValidationResult(true);
  }

  const resolverArgs = createResolverArgs(args);

  const pendingValidation = makeCancelable(
    dispatch(asyncRule, resolverArgs, form.context);
  );

  const res = await pendingValidation.itself;
  const { valid, ...extraProps } = res;

  const rejectedRules = valid ? [] : createRejectedRule({
    name: errorTypes.async,
    isCustom: true
  });

  return createValidationResult(valid, rejectedRules, extraProps);
}
