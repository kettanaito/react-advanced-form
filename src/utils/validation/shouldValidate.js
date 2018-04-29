// @flow
import camelize from '../camelize';
import getRules from './getRules';

export type TValidationType = 'sync' | 'async';

export const validationTypes: TValidationType[] = ['sync', 'async'];

export default function shouldValidate(
  validationTypes: TValidationType[],
  fieldProps,
  schema
): boolean {
  const isAlreadyValid = validationTypes.every((validationType) => {
    const validProp = camelize('valid', validationType);
    return fieldProps.get(validProp);
  });

  console.groupCollapsed('shouldValidate', fieldProps.name);

  console.log({ validationTypes });
  console.log({ isAlreadyValid })

  if (isAlreadyValid) {
    console.log('is already valid, bypassing...');
    console.groupEnd();
    return false;
  }

  if (validationTypes.includes('sync')) {
    console.log('sync validation, trying to grab rules...')
    const fieldRules = getRules(fieldProps, schema);

    if (fieldProps.has('rule') || fieldRules.name || fieldRules.type) {
      console.log('has relative rules, returning true!');
      console.groupEnd();
      return true;
    }
  }

  if (validationTypes.includes('async') && fieldProps.has('asyncRule')) {
    console.log('is async validation and has asyncRule, true!');
    console.groupEnd();
    return true;
  }

  if (fieldProps.required) {
    console.log('is required, true!');
    console.groupEnd();
    return true;
  }

  console.log('none of the above, bypassing...');
  console.groupEnd();

  return false;
}

/**
 * Returns the collection of validation types necessary for
 * the given field record.
 */
export function getNecessaryValidationTypes(fieldProps) {
  return shouldValidate(validationTypes, fieldProps);
}
