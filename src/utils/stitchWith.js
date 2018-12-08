// @flow
import * as R from 'ramda'

type Needle = (entry: mixed, keyPath: string[], acc: Object) => mixed
type ThreadPath = (entry: mixed, acc: Object) => string[]

/**
 * Takes a list and produces an Object, where each needle (entry)
 * is deeply merged using the thread path as the key path.
 */
const stitchWith = R.curry<ThreadPath, Needle, mixed[]>(
  (threadPath, needle, list) =>
    R.reduce(
      (acc, entry) => {
        const keyPath = threadPath(entry, acc)
        return R.assocPath(keyPath, needle(entry, keyPath, acc), acc)
      },
      {},
      list,
    ),
)

export default stitchWith
