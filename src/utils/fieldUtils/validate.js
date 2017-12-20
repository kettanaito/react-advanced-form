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
import validationTypes from '../../const/validation-types';

function ensureInterface({ type, expected, ...restParams }) {
  const types = (type === validationTypes.both) ? [validationTypes.sync, validationTypes.async] : [type];

  const validationParams = types.reduce((params, type) => {
    params[`validated${type}`] = true;
    params[`valid${type}`] = expected;

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

  const shouldValidateSync = [validationTypes.both, validationTypes.sync].includes(type);
  const shouldValidateAsync = [validationTypes.both, validationTypes.async].includes(type);

  let result = {
    validatedSync: false,
    validatedAsync: false,
    validSync: false,
    validAsync: false
  };

  if (shouldValidateSync) {
    const syncValidationResult = validateSync({ fieldProps, fields, form, formRules });

    if ((type === validationTypes.sync) || !syncValidationResult.expected) {
      return ensureInterface({ ...syncValidationResult, type });
    }
  }

  if (shouldValidateAsync) {
    const asyncValidationResult = await validateAsync({ fieldProps, fields, form });
    return ensureInterface({ ...asyncValidationResult, type });
  }
}
