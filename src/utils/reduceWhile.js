export const returnsExpected = async (reducedResult) => {
  const awaitedResult = await reducedResult
  console.log(' ')
  console.groupCollapsed('returns expeted?')
  console.log('reduced result:', awaitedResult)
  console.warn('expected?', awaitedResult.expected)
  console.groupEnd()
  console.log(' ')

  /**
   * Explicitly forbid "false" because:
   * - true: field is expected
   * - undefined: no validation necessary
   */
  return awaitedResult.expected !== false
}

const getInitialState = () => ({
  expected: null,
  validators: [],
  rejectedRules: [],
  extra: null,
})

const createReducer = (...args) => async (acc, func) => {
  const prevAcc = await acc
  const {
    rejectedRules: prevRejectedRules,
    validators: prevValidators,
  } = prevAcc

  console.log(' ')
  console.groupCollapsed('reduceWhileExpected')
  console.log('prevAcc:', prevAcc)
  console.log('current func:', func)

  const funcResult = await func(...args)
  console.log('func result:', funcResult)

  if (!funcResult) {
    console.warn('no func res, returning prevAcc!')
    console.groupEnd()
    console.log(' ')

    return prevAcc
  }

  const { name, expected, rejectedRules, extra } = funcResult
  const nextValidators = name ? prevValidators.concat(name) : prevValidators

  /**
   * Inherit previous value when the next "expected" is "null",
   * which reads "no validation necessary". This handles concurrent
   * validation results of multiple validators properly.
   */
  const nextExpected = expected !== null ? expected : prevAcc.expected
  const nextRejectedRules = rejectedRules
    ? prevRejectedRules.concat(rejectedRules)
    : prevRejectedRules

  const nextAcc = {
    expected: nextExpected,
    rejectedRules: nextRejectedRules,
    validators: nextValidators,
    extra,
  }

  console.warn('returning "nextAcc":', nextAcc)
  console.groupEnd()
  console.log(' ')

  return nextAcc
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
export const reduceResultsWhile = (predicate, funcs) => {
  return (...args) => {
    return funcs.reduce(async (acc, func) => {
      return (await predicate(acc)) ? createReducer(...args)(acc, func) : acc
    }, getInitialState())
  }
}
