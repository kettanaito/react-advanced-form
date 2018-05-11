import dispatch from '../../dispatch'

export default function applyResolver(resolver, resolverArgs) {
  return dispatch(resolver, resolverArgs, resolverArgs.form.context)
}
