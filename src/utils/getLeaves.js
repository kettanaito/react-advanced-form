import * as R from 'ramda'

/**
 * Accepts an object and returns a list of its leaves.
 */
// const getLeaves = when(
//   is(Object),
//   compose(
//     (vals) => chain(getLeaves, vals),
//     values,
//   ),
// )

const createLeavesGetter = (predicate) => {
  return R.ifElse(
    R.is(Object),
    R.compose(
      R.reject(R.isNil),
      R.chain(R.when(R.complement(predicate), getLeavesWhich(predicate))),
      R.values,
    ),
    () => null,
  )
}

/**
 * Returns the list of the object's leaves that satisfy the given predicate.
 * @param {Function<boolean>} predicate
 * @param {Object} obj
 * @returns {any[]}
 */
const getLeavesWhich = R.curry((predicate, obj) => {
  return createLeavesGetter(predicate)(obj)
})

export default getLeavesWhich
