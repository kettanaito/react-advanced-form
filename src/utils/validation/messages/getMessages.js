import map from 'ramda/src/map'
import compose from 'ramda/src/compose'

import getResolvePaths from './getResolvePaths'
import createMessageResolverArgs from './createMessageResolverArgs'
import resolveMessage from './resolveMessage'
import pruneMessages from './pruneMessages'

const createResolveIterator = (resolverArgs, messagesSchema) => {
  const { fieldProps } = resolverArgs
  const messageResolverArgs = createMessageResolverArgs(resolverArgs)

  return ([rule, keyPathGetters]) =>
    map((keyPathGetter) => {
      if (keyPathGetter === null) {
        return keyPathGetter
      }

      const keyPath = keyPathGetter(rule, fieldProps)
      const resolver = messagesSchema.getIn(keyPath)
      return resolveMessage(resolver, resolverArgs)
    })(keyPathGetters)
}

/**
 * Returns the list of error messages relevant to the given rejected rules
 * found in the given messages schema. Abides by the resolving algorithm.
 */
export default function getErrorMessages(
  rejectedRules,
  resolverArgs,
  messagesSchema,
) {
  const resolvePaths = rejectedRules.map(getResolvePaths)
  const messages = compose(
    pruneMessages,
    map(createResolveIterator(resolverArgs, messagesSchema)),
  )(resolvePaths)

  return messages
}
