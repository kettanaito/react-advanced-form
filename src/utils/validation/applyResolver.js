import invariant from 'invariant'
import dispatch from '../dispatch'

export default function applyResolver(resolver, resolverArgs) {
  invariant(
    resolver && typeof resolver === 'function',
    'Failed to apply the resolver to `%s` field. Expected resolver to be a function, but got: %s',
    resolverArgs.fieldProps.displayFieldPath,
    resolver,
  )

  return dispatch(resolver, resolverArgs, resolverArgs.form.context)
}
