/**
 * Determines whether the given Field is valid.
 * Validation of each field is a complex process consisting of several steps.
 * It is important to resolve the validation immediately once the field becomes invalid.
 * @param {Map} fieldProps
 * @param {Map} fields
 * @param {object} form
 * @param {Map} formRules
 * @return {boolean}
 */
import { Map } from 'immutable';
import validateSync from './validateSync';
import validateAsync from './validateAsync';
import capitalize from '../capitalize';

function ensureInterface({ type, expected, ...restParams }) {
  const types = type === 'both' ? ['sync', 'async'] : [type];

  const validationParams = types.reduce((params, type) => {
    params[`validated${capitalize(type)}`] = true;
    params[`valid${capitalize(type)}`] = expected;

    return params;
  }, {});

  return {
    ...restParams,
    ...validationParams,
    expected
  };
}

export default async function validate({ type, fieldProps, fields, form, formRules = Map() }) {
  console.groupCollapsed('fieldUtils @ validate', fieldProps.get('fieldPath'));
  console.log('type', type);
  console.log('fieldProps', Object.assign({}, fieldProps.toJS()));
  console.log('fields', fields);
  console.log('form', form);
  console.log('formRules', formRules.toJS());
  console.groupEnd();

  if (['both', 'sync'].includes(type)) {
    const syncValidationResult = validateSync({ fieldProps, fields, form, formRules });

    if (type === 'sync') return ensureInterface({
      type,
      ...syncValidationResult
    });

    if (!syncValidationResult.expected) return ensureInterface({
      type,
      ...syncValidationResult
    });
  }

  if (['both', 'async'].includes(type)) {
    const asyncValidationResult = await validateAsync({ fieldProps, fields, form });
    return ensureInterface({
      type,
      ...asyncValidationResult
    });
  }
}
