// @flow
import dispatch from '../../dispatch'

type TMessageResolverArgs = {}
type TMessageResolver = (args: TMessageResolverArgs) => string
type TResolvable = TMessageResolver | string

/**
 * Accepts a message resolver, which can be a Function or a String
 * and always returns a String.
 */
export default function resolveMessage(
  resolver: TResolvable,
  resolverArgs: TMessageResolverArgs,
): string {
  return typeof resolver === 'function'
    ? dispatch(resolver, resolverArgs, resolverArgs.form.context)
    : resolver
}
