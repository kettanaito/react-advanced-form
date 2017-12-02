/**
 * Determines whether a Field with the provided props should be validated.
 * @param {Map} fieldProps
 */
export default function shouldValidateField(fieldProps) {
  const validatedSync = fieldProps.get('validatedSync');
  const required = fieldProps.get('required');

  const hasDynamicRequired = (typeof required === 'function');
  const shouldValidate = hasDynamicRequired || (!validatedSync && required);

  // console.groupCollapsed('fieldUtils @ shouldValidateField');
  // console.log('was validated before (sync):', validatedSync);
  // console.log('"required" prop is dynamic (func):', hasDynamicRequired);
  // console.log('should validate:', shouldValidate);
  // console.groupEnd();

  return shouldValidate;
}
