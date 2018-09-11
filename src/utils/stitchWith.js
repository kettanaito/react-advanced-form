// @flow
import * as R from 'ramda'

type Needle = (entry: any, keyPath: string[], acc: Object) => mixed

/**
 * Accepts a needle, its thread path, and a list of objects.
 * Returns a stitched object, where each entry is added by
 * the thread path using the needle function.
 * @param {Function} needle
 * @param {string[]} threadPath
 * @param {Object[]} list
 * @returns {Object}
 */
const stitchWith = R.curry(
  (needle: Needle, threadPath: string[], list: any[]) => {
    return R.reduce(
      (acc, entry) => {
        const keyPath = R.path(threadPath, entry)
        return R.assocPath(keyPath, needle(entry, keyPath, acc), acc)
      },
      {},
      list,
    )
  },
)

export default stitchWith
