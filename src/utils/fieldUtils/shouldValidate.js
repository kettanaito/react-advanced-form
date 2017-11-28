/**
 * Determines whether a Field with the provided props should be validated.
 * @param {object} fieldProps
 */
export default function shouldValidateField({ fieldProps: { validated, required } }) {
  const hasDynamicRequired = (typeof required === 'function');
  const shouldValidate = !validated || hasDynamicRequired;

  // console.groupCollapsed('fieldUtils @ shouldValidateField');
  // console.log('was validated before:', validated);
  // console.log('"required" prop is dynamic (func):', hasDynamicRequired);
  // console.log('should validate:', shouldValidate);
  // console.groupEnd();

  return shouldValidate;
}
