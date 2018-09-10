import * as R from 'ramda'

const firstFullPair = R.find((value) => !!value)

/**
 * Transposes the array of arrays of error messages,
 * groupes them by their resolving key group/priority,
 * removes "null" placeholders and "undefined" messages,
 * and returns the first messages group that is not empty.
 */
const pruneMessages = R.compose(
  R.find(firstFullPair),
  R.map(
    R.compose(
      R.uniq,
      R.filter(Boolean),
    ),
  ),
  R.transpose,
)

export default pruneMessages
