/**
 * Determines whether the given Field is valid.
 * Validation of each field is a complex process consisting of several steps.
 * It is important to resolve the validation immediately once the field becomes invalid.
 * @param {Map} fieldProps
 * @param {Map} fields
 * @param {object} form
 * @param {object} formRules
 * @return {boolean}
 */
import validateSync from './validateSync';
import validateAsync from './validateAsync';

export default async function validate({ type, fieldProps, fields, form, formRules = {} }) {
  console.groupCollapsed('fieldUtils @ validate', fieldProps.get('fieldPath'));
  console.log('type', type);
  console.log('fieldProps', Object.assign({}, fieldProps.toJS()));
  console.log('fields', fields);
  console.log('form', form);
  console.log('formRules', formRules);
  console.groupEnd();

  if (['both', 'sync'].includes(type)) {
    const syncValidationResult = validateSync({ fieldProps, fields, form, formRules });
    // console.log('syncValidation:', syncValidationResult);
    if (type === 'sync') return syncValidationResult;
    if (!syncValidationResult.expected) return syncValidationResult;
  }

  if (['both', 'async'].includes(type)) {
    const asyncValidationResult = await validateAsync({ fieldProps, fields, form, formRules });
    // console.log('asyncValidationResult', asyncValidationResult);
    return asyncValidationResult;
  }
}
