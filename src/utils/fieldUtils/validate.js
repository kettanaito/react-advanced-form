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

const validators = { validateSync, validateAsync };

export default async function validate({ type, fieldProps, fields, form, formRules = Map() }) {
  console.groupCollapsed('fieldUtils @ validate', fieldProps.get('fieldPath'));
  console.log('type', type);
  console.log('fieldProps', Object.assign({}, fieldProps.toJS()));
  console.log('fields', fields);
  console.log('form', form);
  console.log('formRules', formRules.toJS());
  console.groupEnd();

  const patch = {};

  for (let i = 0; i < type.types.length; i++) {
    const typeName = type.types[i];
    const validatorFunc = validators[`validate${typeName}`];

    const result = await validatorFunc({ fieldProps, fields, form, formRules });
    const { expected, ...restParams } = result;

    patch[`validated${typeName}`] = true;
    patch[`valid${typeName}`] = expected;
    patch.expected = expected;

    if (type.isSync || !expected) {
      return { ...restParams, ...patch };
    }
  }

  return patch;

  // if (shouldValidateSync) {
  //   const result = validateSync({ fieldProps, fields, form, formRules });
  //   const { expected, ...restParams } = result;

  //   patch.validatedSync = true;
  //   patch.validSync = expected;
  //   patch.expected = expected;

  //   if (type.isSync || !expected) {
  //     return { ...restParams, ...patch };
  //   }
  // }

  // if (shouldValidateAsync) {
  //   const result = await validateAsync({ fieldProps, fields, form });
  //   const { expected, ...restParams } = result;

  //   patch.validatedAsync = true;
  //   patch.validAsync = expected;
  //   patch.expected = expected;

  //   return { ...restParams, ...patch };
  // }
}
