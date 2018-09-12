import * as R from 'ramda'

const firstValueOfList = R.find((value) => !!value)

/**
 * Transposes the array of arrays of error messages,
 * groupes them by their resolving key group/priority,
 * removes "null" placeholders and "undefined" messages,
 * and returns the first messages group that is not empty.
 */
const pruneMessages = R.compose(
  R.find(firstValueOfList),
  R.map(
    R.compose(
      R.uniq,
      R.reject(R.isNil),
    ),
  ),
  R.transpose,
)

export default pruneMessages
