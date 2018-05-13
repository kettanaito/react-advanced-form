import invariant from 'invariant'
import createPropGetter from '../fieldUtils/createPropGetter'

/**
 * Returns the unified interface of each validation rule resolver
 * arguments Object based on the passed arguments.
 */
export default function createResolverArgs(args) {
  const { fieldProps, fields, form } = args

  invariant(
    fieldProps && fields && form,
    'Failed to create resolver args. Expected `fieldProps`, `fields` and `form` to be passed, ' +
      'but got: %s, %s, %s (respectively).',
    fieldProps,
    fields,
    form,
  )

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
