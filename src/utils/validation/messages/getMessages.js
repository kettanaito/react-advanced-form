import * as R from 'ramda'
import getResolvePaths from './getResolvePaths'
import resolveMessage from './resolveMessage'
import pruneMessages from './pruneMessages'

const createResolveIterator = (validationResult, payload, messages) => {
  const messagePayload = {
    ...payload,
    ...validationResult.extra,
  }

  return ([rule, keyPathGetters]) =>
    keyPathGetters.map((keyPathGetter) => {
      if (keyPathGetter === null) {
        return keyPathGetter
      }

      const keyPath = keyPathGetter(rule, payload.fieldProps)
      const resolver = R.path(keyPath, messages)

      return resolveMessage(resolver, messagePayload)
    })
}

/**
 * Returns the list of error messages relevant to the given list of rejected rules
 * found in the given messages schema. Follows the resolving algorithm.
 */
export default function getErrorMessages(validationResult, payload, messages) {
  if (!messages) {
    return
  }

  /**
   * Iterates over the list of message resolver paths and resolves
   * each path at its place. Then prunes the results, filtering out
   * only the relevant message(s) based on the rejected rule(s) priority.
   */
  return R.compose(
    pruneMessages,
    R.map(createResolveIterator(validationResult, payload, messages)),
    R.map(getResolvePaths),
  )(validationResult.rejectedRules)
}
