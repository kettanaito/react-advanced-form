// @flow

type TSeqPredicate<R> = (result: R, results: R[]) => boolean
export type TSeq<F, A, R> = (predicate: TSeqPredicate<R>) => (...funcs: F[]) => (...args: A[]) => R

/**
 * Generates a sequence that executes the list of the given functions while
 * the predicate for each function result returns true.
 */
const createSeq: TSeq<Function, string, any> = (predicate: TSeqPredicate<*> = () => true) => {
  return (...funcs) => {
    return (...args) => {
      console.groupCollapsed('seq')
      console.log('funcs:', funcs)
      console.log('args:', args)
      console.groupEnd()

      let funcIndex = 0
      let result
      let results = []

      do {
        result = funcs[funcIndex](...args)
        results = results.concat(result)
        funcIndex++
      } while (funcIndex < funcs.length && predicate(result, results))

      return results
    }
  }
}

export default createSeq
