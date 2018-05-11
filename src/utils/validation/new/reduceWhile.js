const reduceWhile = (predicate, funcs) => {
  return (...args) => {
    let isPredicateSatisfied = true

    return funcs.reduce((acc, func) => {
      if (!isPredicateSatisfied) {
        return acc
      }

      const funcResult = func(...args)
      isPredicateSatisfied = predicate(funcResult, acc)

      return isPredicateSatisfied ? acc.concat(funcResult) : acc
    }, [])
  }
}

export const reduceWhileExpected = (funcs) =>
  reduceWhile((validatorResult) => validatorResult.expected, funcs)

export default reduceWhile
