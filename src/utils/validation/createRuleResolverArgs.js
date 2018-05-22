import createPropGetter from '../fieldUtils/createPropGetter'

/**
 * Returns the unified interface of each validation rule resolver
 * arguments Object based on the passed arguments.
 */
export default function createRuleResolverArgs(args) {
  const { fieldProps, fields, form } = args
  const valuePropName = fieldProps.get('valuePropName')
  const value = fieldProps.get(valuePropName)

  return {
    fieldProps,
    fields,
    form,
    [valuePropName]: value,
    get: createPropGetter(fields),
  }
}
