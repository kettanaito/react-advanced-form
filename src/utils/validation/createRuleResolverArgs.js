import createPropGetter from '../fieldUtils/createPropGetter'

/**
 * Returns the unified interface of each validation rule resolver
 * arguments Object based on the passed arguments.
 */
export default function createRuleResolverArgs(payload) {
  const { fieldProps, fields, form } = payload

  // Ensure fields are present, since debounced validation calls
  // do not pass "fields" on purpose to prevent passing fields
  // with the obsolete state.
  const resolvedFields = fields || form.state.fields
  const { valuePropName } = fieldProps
  const value = fieldProps[valuePropName]

  return {
    fieldProps,
    fields: resolvedFields,
    form,
    [valuePropName]: value,
    get: createPropGetter(resolvedFields),
  }
}
