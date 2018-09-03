// @flow
/**
 * Dispatches the given function when the following exists.
 * Returns the return of the given function.
 */
export default function dispatch(func: Function, args: Object) {
  /* When Immutable args allowed, bypass any transformation */
  // const resolvedArgs = withImmutable
  //   ? args
  //   : Object.keys(args).reduce((nextArgs, argName) => {
  //       const argValue: Map<string, mixed> | Object = args[argName]
  //       nextArgs[argName] = Map.isMap(argValue) ? argValue.toJS() : argValue

  //       return nextArgs
  //     }, {})

  return func && func(args)
}
