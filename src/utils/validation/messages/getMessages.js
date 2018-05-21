import getResolvePaths from './getResolvePaths'
import createMessageResolverArgs from './createMessageResolverArgs'
import resolveMessage from './resolveMessage'
import pruneMessages from './pruneMessages'

const createResolveIterator = (resolverArgs, messagesSchema) => {
  const { fieldProps } = resolverArgs
  const messageResolverArgs = createMessageResolverArgs(resolverArgs)

  return ([rule, keyPathGetters]) =>
    keyPathGetters.map((keyPathGetter) => {
      if (keyPathGetter === null) {
        return keyPathGetter
      }

      const keyPath = keyPathGetter(rule, fieldProps)
      const resolver = messagesSchema.getIn(keyPath)
      return resolveMessage(resolver, messageResolverArgs)
    })
}

/**
 * Returns the list of error messages relevant to the given list of rejected rules
 * found in the given messages schema. Follows the resolving algorithm.
 */
export default function getErrorMessages(
  rejectedRules,
  resolverArgs,
  messagesSchema,
) {
  console.groupCollapsed(
    'getErrorMessages',
    resolverArgs.fieldProps.displayFieldPath,
  )
  console.log({ rejectedRules })
  console.log({ resolverArgs })
  console.log({ messagesSchema })

  if (!messagesSchema) {
    console.log('no messages in schema, bypassing...')
    console.groupEnd()
    return
  }

  const resolvePaths = rejectedRules.map(getResolvePaths)
  console.log('resolvePaths:', resolvePaths)

  /**
   * Iterates over the list of message resolvering paths and resolves
   * each path at its place. Then prunes the results, filtering out
   * only the relevant message(s) based on the rejected rule(s) priority.
   */
  const messages = pruneMessages(
    resolvePaths.map(createResolveIterator(resolverArgs, messagesSchema)),
  )

  console.log('messages:', messages)
  console.groupEnd()

  return messages
}
