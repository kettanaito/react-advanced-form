import getResolvePaths from './getResolvePaths'

function createResolveIterator(resolverArgs, schema) {
  const { fieldProps } = resolverArgs

  return ([rule, keyPathGetters]) =>
    keyPathGetters.reduce((message, keyPathGetter) => {
      if (message) {
        return message
      }

      const keyPath = keyPathGetter(rule, fieldProps)
      return schema.getIn(keyPath)
    }, null)
}

export default function getErrorMessages(rules, resolverArgs, schema) {
  const resolvePaths = rules.map(getResolvePaths)
  const resolvedMessages = resolvePaths.map(
    createResolveIterator(resolverArgs, schema),
  )

  return resolvedMessages
}
