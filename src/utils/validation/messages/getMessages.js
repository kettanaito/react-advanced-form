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

export default function getErrorMessages(rules, resolverArgs, messagesSchema) {
  const resolvePaths = rules.map(getResolvePaths)
  return resolvePaths.map(createResolveIterator(resolverArgs, messagesSchema))
}
