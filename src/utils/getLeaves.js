import is from 'ramda/src/is'
import when from 'ramda/src/when'
import compose from 'ramda/src/compose'
import chain from 'ramda/src/chain'
import values from 'ramda/src/values'
import allPass from 'ramda/src/allPass'
import curry from 'ramda/src/curry'

/**
 * Accepts an object and returns a list of its leaves.
 */
const getLeaves = when(
  is(Object),
  compose(
    (vals) => chain(getLeaves, vals),
    values,
  ),
)

export default getLeaves
