// @flow
type TFunc = (...args: mixed[]) => mixed

/**
 * Executes the given function with the result of the predicate
 * only when the predicate is satisfied.
 */
export default function addWhen(predicate: TFunc, func: TFunc) {
  return (...args: mixed[]) => {
    const predicateResult: mixed = predicate(...args)
    return predicateResult && func(predicateResult)
  }
}
