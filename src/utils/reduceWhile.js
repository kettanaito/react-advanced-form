// @flow
import * as R from 'ramda'

type ReduceWhilePredicate = (acc: any, entry: any) => Promise<boolean>
type ReduceWhileReducer = (acc: any, entry: any) => any

/**
 * Reduces the list applying the given reducer function as long as
 * the predicate function resolves to true. Basically, a simple reducer
 * function that accepts promise as a predicate.
 */
const reduceWhile = R.curry(
  (
    predicate: ReduceWhilePredicate,
    reducer: ReduceWhileReducer,
    initialValue: any,
    list: any[],
  ) => {
    return (...args) => {
      return list.reduce(async (acc, entry) => {
        const resolvedAcc = await acc
        return (await predicate(resolvedAcc, entry))
          ? reducer(resolvedAcc, entry, ...args)
          : resolvedAcc
      }, initialValue)
    }
  },
)

export const returnsExpected = async (validationResult) => {
  const { expected } = await validationResult

  /**
   * "expected" may obtain the next values:
   * - true, when the field is expected (valid)
   * - false, when the field is unexpected (invalid)
   * - undefined, when no validation is necessary
   */
  return expected !== false
}

const initialState = {
  expected: null,
  validators: [],
  rejectedRules: [],
  extra: null,
}

const validationReducer = async (accResults, validatorFunc, ...args) => {
  const {
    expected: prevExpected,
    rejectedRules: prevRejectedRules,
    validators: prevValidators,
  } = accResults

  const validatorResult = await validatorFunc(...args)

  if (!validatorResult) {
    return accResults
  }

  const { name, expected, rejectedRules, extra } = validatorResult
  const nextValidators = name ? prevValidators.concat(name) : prevValidators

  /**
   * If the previous "expected" was false, all succeeding validators have
   * no effect over the end "expected" value, it will be "false".
   * @todo This conditional assignment is ugly. Rewrite it.
   */
  let nextExpected = prevExpected !== null ? prevExpected && expected : expected
  const nextRejectedRules = rejectedRules
    ? prevRejectedRules.concat(rejectedRules)
    : prevRejectedRules

  /**
   * When current validator result has explicit "null" as the value of "expected"
   * field, that implies that no validation was necessary. Thus, the previous
   * "expected" value from the accumulated result must be taken.
   */
  if (expected === null) {
    nextExpected = prevExpected
  }

  return {
    expected: nextExpected,
    rejectedRules: nextRejectedRules,
    validators: nextValidators,
    extra,
  }
}

/**
 * Reduces the list of validator functions into accumulated validation result.
 * Reduces the entire list, as its predicate always returns "true".
 */
export const reduceResults = reduceWhile(R.T, validationReducer, initialState)

/**
 * Reduces the list of validator functions while they return expected validation
 * result. Breaks as soon as a validator returns unexpected result.
 */
export const reduceWhileExpected = reduceWhile(
  returnsExpected,
  validationReducer,
  initialState,
)

export default reduceWhile
