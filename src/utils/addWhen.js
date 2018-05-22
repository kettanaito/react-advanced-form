// @flow
/**
 * Executes the given function with the result of the predicate
 * only when the predicate is satisfied.
 */
export default function addWhen(predicate: Function, func: Function) {
  return (...args: mixed[]) => {
    const predicateResult: mixed = predicate(...args)
    return predicateResult && func(predicateResult)
  }
}
