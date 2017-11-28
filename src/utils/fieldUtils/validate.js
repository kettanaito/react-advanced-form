/**
 * Determines whether the given Field is valid.
 * Validation of each field is a complex process consisting of several steps.
 * It is important to resolve the validation immediately once the field becomes invalid.
 * @param {object} fieldProps
 * @param {Map} fields
 * @param {object} formProps
 * @param {object} formRules
 * @return {boolean}
 */
import validateSync from './validateSync';
import validateAsync from './validateAsync';

export default async function validate({ type, fieldProps, fields, formProps, formRules = {} }) {
  // console.groupCollapsed('fieldUtils @ validate', fieldProps.name);
  // console.log('type', type);
  // console.log('fieldProps', fieldProps);
  // console.log('fields', fields);
  // console.log('formProps', formProps);
  // console.log('formRules', formRules);
  // console.groupEnd();

  const isSyncValidation = (type === 'sync');

  if (['both', 'sync'].includes(type)) {
    const syncValidationResult = validateSync({ fieldProps, fields, formProps, formRules });
    // console.log('syncValidation:', syncValidationResult);

    if (isSyncValidation) {

      return syncValidationResult;
    }


    if (!syncValidationResult.expected) {
      // console.log('sync validation failed, returning.');

      return syncValidationResult;
    }
  }

  if (['both', 'async'].includes(type)) {
    const asyncValidationResult = await validateAsync({ fieldProps, fields, formProps, formRules });

    // console.log('asyncValidationResult', asyncValidationResult);

    return asyncValidationResult;
  }
}
