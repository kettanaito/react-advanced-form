export default function shouldValidateAsync({ fieldProps }) {
  const shouldValidate =
    fieldProps.validSync && fieldProps.asyncRule && !fieldProps.validAsync

  console.groupCollapsed(
    `validateAsync @ shouldValidate @ ${fieldProps.displayFieldPath}`,
  )
  console.log('field props:', fieldProps && fieldProps.toJS())
  console.warn('should validate?', shouldValidate)
  console.groupEnd()

  return shouldValidate
}
