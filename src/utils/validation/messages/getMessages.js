import reduceWhile from 'ramda/src/reduceWhile'
import dispatch from '../../dispatch'
import getResolvePaths from './getResolvePaths'
import createMessageResolverArgs from './createMessageResolverArgs'
import resolveMessage from './resolveMessage'

function createResolveIterator(resolverArgs, messagesSchema) {
  const { fieldProps, form } = resolverArgs
  const messageResolverArgs = createMessageResolverArgs(resolverArgs)

  return ([rule, keyPathGetters]) =>
    reduceWhile(
      (message) => !message,
      (message, keyPathGetter) => {
        if (message) {
          return message
        }

        const keyPath = keyPathGetter(rule, fieldProps)
        const resolver = messagesSchema.getIn(keyPath)

        return resolveMessage(resolver, resolverArgs)
      },
      null,
      keyPathGetters,
    )
}

/**
 * Returns the list of error messages relevant to the given rejected rules
 * and messages schema. Abides by the resolving algorithm.
 */
export default function getErrorMessages(
  rejectedRules,
  resolverArgs,
  messagesSchema,
) {
  const resolvePaths = rejectedRules.map(getResolvePaths)
  return resolvePaths.map(createResolveIterator(resolverArgs, messagesSchema))
}
