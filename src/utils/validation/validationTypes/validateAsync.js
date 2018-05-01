// import type { TValidationResult } from '.';
// import type { TValidatorArgs } from './getRules';
// import type { ICancelablePromise } from '../makeCancelable';

import invariant from 'invariant';
import errorTypes from '../errorTypes';
import createResolverArgs from '../createResolverArgs';
import createValidationResult from '../createValidationResult';
import createRejectedRule from '../createRejectedRule';
import dispatch from '../../dispatch';
import makeCancelable from '../../makeCancelable';

// type TAsyncValidationRes = {
//   valid: boolean,
//   [extraPropName: string]: any
// };

export default async function validateAsync(args) {
  const resolverArgs = createResolverArgs(args);
  const { value, fieldProps, form } = resolverArgs;

  /**
   * Treat already async valid field as expected.
   * In other words, prevent repetitive async validation over a field
   * which has been already proven valid async. This works because each
   * field change handler resets the validation state of the field.
   */
  if (fieldProps.validAsync) {
    return createValidationResult(true);
  }

  const { asyncRule } = fieldProps;

  /* Treat empty field or field without async rule as expected */
  if (!asyncRule || !value) {
    return createValidationResult(true);
  }

  const pendingValidation = makeCancelable(
    dispatch(asyncRule, resolverArgs, form.context)
  );

  //
  // TODO
  // Pending validation reference must be set on the field's record in order
  // to cancel itself on field change. This breaks the functional paradigm and
  // creates a side effect for this validation function.
  // Think of another way of getting pending validation (req) reference.
  //

  const res = await pendingValidation.itself;
  const { valid, ...extraProps } = res;

  invariant(res && res.hasOwnProperty('valid'), 'Failed to async validate the `%s` field. ' +
  'Expected `asyncRule` to resolve with an Object containing a `valid` prop, but got: %s',
  fieldProps.name, res);

  const rejectedRules = valid ? undefined : createRejectedRule({
    name: errorTypes.async,
    isCustom: true
  });

  return createValidationResult(valid, rejectedRules, extraProps);
}
