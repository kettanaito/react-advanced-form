import * as R from 'ramda'

export const returnsExpected = async (validationResult) => {
  const resolvedResult = await validationResult

  /**
   * "expected" may obtain the next values:
   * - true, when the field is expected (valid)
   * - false, when the field is unexpected (invalid)
   * - undefined, when no validation is necessary
   */
  return resolvedResult.expected !== false
}

const getInitialState = () => ({
  expected: null,
  validators: [],
  rejectedRules: [],
  extra: null,
})

const createReducer = (...args) => async (pendingResults, func) => {
  const accResults = await pendingResults
  const {
    expected: prevExpected,
    rejectedRules: prevRejectedRules,
    validators: prevValidators,
  } = accResults

  const validatorResult = await func(...args)

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
 * Reduces the given list of functions that return validation result
 * into accumulated validation result.
 */
export const reduceResults = (funcs) => {
  return (...args) => {
    return funcs.reduce(createReducer(...args), getInitialState())
  }
}

/**
 * Reduces the list of functions that return validation result
 * into accumulated validation result while each function satisfies
 * the given predicate.
 */
export const reduceResultsWhile = R.curry((predicate, validatorsList) => {
  return (...args) => {
    return validatorsList.reduce(async (acc, validatorFunc) => {
      return (await predicate(acc))
        ? createReducer(...args)(acc, validatorFunc)
        : acc
    }, getInitialState())
  }
})

export const reduceWhileExpected = reduceResultsWhile(returnsExpected)
