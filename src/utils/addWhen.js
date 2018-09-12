// @flow
type TFunc = (...args: mixed[]) => mixed

/**
 * Executes the given function with the result of the predicate
 * only when the predicate is satisfied.
 */
export default function addWhen(subject: mixed, predicate: TFunc, func: TFunc) {
  return () => predicate(subject) && func(subject)
}
