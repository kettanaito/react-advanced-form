// @flow
import compose from 'ramda/src/compose'
import map from 'ramda/src/map'
import find from 'ramda/src/find'
import transpose from 'ramda/src/transpose'
import filter from 'ramda/src/filter'
import uniq from 'ramda/src/uniq'

const firstMatch = find((value) => !!value)
const pruneMessages = compose(
  find(firstMatch),
  map(compose(uniq, filter(Boolean))),
  transpose,
)

export default pruneMessages
