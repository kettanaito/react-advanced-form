// @flow

export type TParallel<F, A, R> = (...funcs: F[]) => (...args: A[]) => R;

/**
 * Creates a parallel function iterator that executes the list of the given functions
 * and accumulates their results into a single list.
 */
export const parallel: TParallel<Function, any, any> = (...funcs) => {
  return (...args) => {
    return funcs.reduce((payload, func: Function) => {
      return payload.concat(func(...args));
    }, []);
  };
}

type TSeqPredicate<R> = (result: R, results: R[]) => boolean;
export type TSeq<F, A, R> = (predicate: TSeqPredicate<R>) => (...funcs: F[]) => (...args: A[]) => R;

/**
 * Generates a sequence that executes the list of the given functions while
 * the predicate for each function result returns true.
 */
export const createSeq: TSeq<Function, string, any> = (predicate) => {
  return (...funcs) => {
    return (...args) => {
      let funcIndex = 0;
      let result;
      let results = [];

      do {
        result = funcs[funcIndex](...args);
        results = results.concat(result);
        funcIndex++;
      } while ((funcIndex < funcs.length) && predicate(result, results));

      return results;
    };
  };
}
