// @flow
import dispatch from '../../dispatch'

type MessageResolverArgs = {
  value: any,
  fieldProps: Object,
  fields: Object,
  form: Object,
}

type MessageResolver = (args: MessageResolverArgs) => string
type MessageResolvable = MessageResolver | string

/**
 * Accepts a resolvable, which can be a Function or a String
 * and returns a resolved message string.
 */
export default function resolveMessage(
  resolvable: MessageResolvable,
  resolverArgs: MessageResolverArgs,
): string {
  return typeof resolvable === 'function'
    ? dispatch(resolvable, resolverArgs)
    : resolvable
}
