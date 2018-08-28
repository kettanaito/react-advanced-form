// @flow
import { Map } from 'immutable'

type TDispatchContext = {
  withImmutable?: boolean,
}

/**
 * Dispatches the provided function after applying conditional transformations
 * to its params based on the passed context options.
 */
export default function dispatch(
  func: Function,
  args: Object,
  context: TDispatchContext = {},
  overrides: Object = {},
) {
  if (!func) {
    return
  }

  const { withImmutable } = context

  /* When Immutable args allowed, bypass any transformation */
  const resolvedArgs = withImmutable
    ? args
    : Object.keys(args).reduce((nextArgs, argName) => {
        const argValue: Map<string, mixed> | Object = args[argName]
        nextArgs[argName] = Map.isMap(argValue) ? argValue.toJS() : argValue

        return nextArgs
      }, {})

  return func({
    ...resolvedArgs,
    ...overrides,
  })
}
