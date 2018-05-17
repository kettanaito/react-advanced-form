import dispatch from '../../dispatch'

export default function resolveMessage(resolver, resolverArgs) {
  return typeof resolver === 'function'
    ? dispatch(resolver, resolverArgs, resolverArgs.form.context)
    : resolver
}
