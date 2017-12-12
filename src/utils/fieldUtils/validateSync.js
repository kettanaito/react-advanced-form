/**
 * Synchronously validated the provided field.
 */
// import { resolveProp } from './resolveProp';

export default function validateSync({ fieldProps, fields, form, formRules }) {
  /* Bypass validation for already valid field */
  if (fieldProps.get('validSync')) return { expected: true };

  let isExpected = true;

  const name = fieldProps.get('name');
  const type = fieldProps.get('type');
  const value = fieldProps.get('value');
  const required = fieldProps.get('required');
  const rule = fieldProps.get('rule');
  const asyncRule = fieldProps.get('asyncRule');

  /* Resolve resolvable props */
  /* const required = resolveProp({
    propName: 'required',
    fieldProps,
    fields
  });
  */

  // console.groupCollapsed('fieldUtils @ validateSync', fieldProps.get('fieldPath'));
  // console.log('fieldProps', Object.assign({}, fieldProps.toJS()));
  // console.log('required:', required);
  // console.log('value:', value);

  /* Treat optional empty fields as expected */
  if (!value && !required) {
    // console.log('Empty optional field - bypass');
    // console.groupEnd();

    return { expected: true };
  }

  if (!value && required) {
    // console.log('Empty required field, UNEXPECTED!');
    // console.groupEnd();

    return { expected: false, errorType: 'missing' };
  }

  /* Assume Field doesn't have any specific validation attached */
  const formTypeRule = formRules.getIn(['type', type]);
  const formNameRule = formRules.getIn(['name', name]);
  const hasFormRules = formTypeRule || formNameRule;

  if (!rule && !asyncRule && !hasFormRules) {
    // console.log('Does not have rule, asyncRule or formRules, bypass');
    // console.groupEnd();

    return { expected: true };
  }

  const mutableFieldProps = fieldProps.toJS();

  /* Format (sync) validation */
  if (rule) {
    // console.log('Field has "rule":', rule);

    /* Test the RegExp against the field's value */
    isExpected = (typeof rule === 'function')
      ? rule({ value, fieldProps: mutableFieldProps, fields: fields.toJS(), form })
      : rule.test(value);

    // console.log('isExpected:', isExpected);
    if (!isExpected) {
      // console.groupEnd();

      return { expected: false, errorType: 'invalid' };
    }
  }

  /**
   * Form-level validation.
   * A form-wide validation provided by "rules" property of the Form.
   * The latter property is also inherited from the context passed by FormProvider.
   */
  if (hasFormRules) {
    // console.log('Has form rules');

    /* Form-level validation */
    const isValidByType = formTypeRule
      ? formTypeRule({ value, fieldProps: mutableFieldProps, fields: fields.toJS(), form })
      : true;

    const isValidByName = formNameRule
      ? formNameRule({ value, fieldProps: mutableFieldProps, fields: fields.toJS(), form })
      : true;

    // console.log('isValidByName', isValidByName);
    // console.log('isValidByType', isValidByType);

    isExpected = (isValidByType && isValidByName);

    // console.log('isExpected:', isExpected);
    if (!isExpected) {
      // console.groupEnd();

      return { expected: false, errorType: 'invalid' };
    }
  }

  // console.groupEnd();

  return { expected: isExpected };
}
