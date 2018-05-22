import reduceWhile from 'ramda/src/reduceWhile'

export const returnsExpected = (reducedResult) => {
  return reducedResult.expected
}

const getInitialState = () => ({
  validators: [],
  expected: true,
  rejectedRules: [],
})

const createReducer = (...args) => {
  return (acc, func) => {
    const { rejectedRules: prevRejectedRules } = acc

    console.groupCollapsed('reduceWhileExpected')
    console.log('acc:', acc)
    console.log('current func:', func)

    const funcResult = func(...args)
    console.log('func result:', funcResult)
    console.groupEnd()

    if (!funcResult) {
      return acc
    }

    const nextValidators = acc.validators.concat(funcResult.name)
    const nextExpected = funcResult.expected
    const nextRejectedRules = funcResult.rejectedRules
      ? prevRejectedRules.concat(funcResult.rejectedRules)
      : prevRejectedRules

    acc.validators = nextValidators
    acc.expected = nextExpected
    acc.rejectedRules = nextRejectedRules

    return acc
  }
}

export const reduceResults = (funcs) => {
  return (...args) => {
    return funcs.reduce(createReducer(...args), getInitialState())
  }
}

export const reduceResultsWhile = (predicate, funcs) => {
  return (...args) => {
    return reduceWhile(
      predicate,
      createReducer(...args),
      getInitialState(),
      funcs,
    )
  }
}
