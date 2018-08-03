export const returnsExpected = async (validationResult) => {
  const resolvedResult = await validationResult

  /**
   * Explicitly forbid "false" because:
   * - true: field is expected
   * - undefined: no validation necessary
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
   * Inherit previous value when the next "expected" is "null",
   * which reads "no validation necessary". This handles concurrent
   * validation results of multiple validators properly.
   */
  const nextExpected = expected !== null ? expected : accResults.expected
  const nextRejectedRules = rejectedRules
    ? prevRejectedRules.concat(rejectedRules)
    : prevRejectedRules

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
export const reduceResultsWhile = (predicate, validatorsList) => {
  return (...args) => {
    return validatorsList.reduce(async (acc, validatorFunc) => {
      return (await predicate(acc))
        ? createReducer(...args)(acc, validatorFunc)
        : acc
    }, getInitialState())
  }
}

export const reduceWhileExpected = (validatorsList) => {
  return reduceResultsWhile(returnsExpected, validatorsList)
}
