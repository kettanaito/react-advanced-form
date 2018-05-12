import { reduceWhile } from 'ramda'

export const always = () => true

export const returnsExpected = (reducedResult) => {
  return reducedResult.expected
}

export const reduceResultsWhile = (predicate, funcs) => (...args) => {
  return reduceWhile(
    predicate,
    (acc, func) => {
      const { rejectedRules: prevRejectedRules } = acc

      console.groupCollapsed('reduceWhileExpected')
      console.log({ acc })

      const validatorResult = func(...args)

      console.log({ validatorResult })

      const { expected: nextExpected } = validatorResult
      const nextRejectedRules = validatorResult.rejectedRules
        ? prevRejectedRules.concat(validatorResult.rejectedRules)
        : prevRejectedRules

      console.groupEnd()

      acc.expected = nextExpected
      acc.rejectedRules = nextRejectedRules

      return acc
    },
    {
      expected: true,
      rejectedRules: [],
    },
    funcs,
  )
}
