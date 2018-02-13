/**
 * Asynchronous validation of field.
 * @param {Map} fieldProps
 * @param {Map} fields
 * @param {Object} form
 */
import invariant from 'invariant';
import { commonErrorTypes, createRejectedRule, composeResult } from './validate';
import { dispatch, makeCancelable } from '../../utils';

export default async function validateAsync({ fieldProps, fields, form }) {
  /* Already async validated fields are bypassed */
  if (fieldProps.get('validAsync')) {
    return composeResult(true);
  }

  const value = fieldProps.get('value');
  const asyncRule = fieldProps.get('asyncRule');

  /* Optional empty fields are bypassed */
  if (!asyncRule || !value) {
    return composeResult(true);
  }

  /* Call the async rule resolver */
  const wrappedPromise = makeCancelable(dispatch(asyncRule, {
    value,
    fieldProps,
    fields,
    form
  }, form.context));

  /**
   * Pass the reference to the cancelable promise to the field record so it would be possible
   * to cancel the async validation on field validation state reset (i.e. onChange).
   */
  form.updateField({
    fieldProps,
    propsPatch: {
      pendingAsyncValidation: wrappedPromise
    }
  });

  const res = await wrappedPromise.itself;

  invariant(res && res.hasOwnProperty('valid'), 'Failed to async validate the `%s` field. ' +
  'Expected `asyncRule` to resolve with an Object containing a `valid` prop, but got: %s',
  fieldProps.get('name'), res);

  const { valid, ...extra } = res;

  const rejectedRules = valid ? [] : createRejectedRule({
    name: commonErrorTypes.async,
    isCustom: true
  });

  return composeResult(valid, rejectedRules, extra);
}
