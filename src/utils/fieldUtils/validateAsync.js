/**
 * Asynchronous validation of field.
 * @param {Map} fieldProps
 * @param {Map} fields
 * @param {Object} form
 */
import invariant from 'invariant';
import { commonErrorTypes, createRejectedRule, composeResult } from './validate';

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
  const res = await asyncRule({
    value,
    fieldProps: fieldProps.toJS(),
    fields: fields.toJS(),
    form
  });

  invariant(res && res.hasOwnProperty('valid'), 'Failed to async validate the `%s` field. ' +
  'Expected `asyncRule` to resolve with an Object containing a `valid` prop, but got: %s',
  fieldProps.get('name'), res);

  const { valid, ...extra } = res;

  const rejectedRules = valid ? [] : createRejectedRule({
    name: commonErrorTypes.async
  });

  return composeResult(valid, rejectedRules, extra);
}
