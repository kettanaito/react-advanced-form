import reduceWhile from 'ramda/src/reduceWhile'

export const always = () => true

export const returnsExpected = (reducedResult) => {
  return reducedResult.expected
}

export const reduceResultsWhile = (predicate, funcs) => (...args) => {
  return reduceWhile(
    predicate,
    (acc, func) => {
      const prevRejectedRules = acc.rejectedRules

      console.groupCollapsed('reduceWhileExpected')
      console.log({ func })
      console.log({ acc })

      const funcResult = func(...args)

      console.log({ funcResult })

      const nextValidators = acc.validators.concat(funcResult.name)
      const nextExpected = funcResult.expected
      const nextRejectedRules = funcResult.rejectedRules
        ? prevRejectedRules.concat(funcResult.rejectedRules)
        : prevRejectedRules

      console.groupEnd()

      acc.validators = nextValidators
      acc.expected = nextExpected
      acc.rejectedRules = nextRejectedRules

      return acc
    },
    {
      validators: [],
      expected: true,
      rejectedRules: [],
    },
    funcs,
  )
}
