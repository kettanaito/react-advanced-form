import * as R from 'ramda'

/**
 * Accepts a needle and a list of objects, and returns a single
 * object where each list entry is set as a deep path using
 * the property of a list entry retrieved using the given needle.
 * @param {string[]} needleKeyPath
 * @param {Object[]} list
 * @returns {Object}
 * @example
 * stitchBy(['k'], [{ k: 'a', v: 1 }, { k: 'b', v: 2}])
 * // { a: [{ k: 'a', v: 1 }], b: [{ k: 'b', v: 2 }] }
 */
const stitchBy = R.curry((needleKeyPath, list) => {
  return R.reduce((acc, entry) => {
    const keyPath = R.path(needleKeyPath, entry)

    return R.assocPath(
      keyPath,
      R.append(entry, R.pathOr([], keyPath, acc)),
      acc,
    )
  }, {})(list)
})

export default stitchBy
