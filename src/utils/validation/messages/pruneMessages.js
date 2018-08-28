import compose from 'ramda/src/compose'
import map from 'ramda/src/map'
import find from 'ramda/src/find'
import transpose from 'ramda/src/transpose'
import filter from 'ramda/src/filter'
import uniq from 'ramda/src/uniq'

const firstFullPair = find((value) => !!value)

/**
 * Transposes the array of arrays of error messages,
 * groupes them by their resolving key group/priority,
 * removes "null" placeholders and "undefined" messages,
 * and returns the first messages group that is not empty.
 */
const pruneMessages = compose(
  find(firstFullPair),
  map(compose(uniq, filter(Boolean))),
  transpose,
)

export default pruneMessages
