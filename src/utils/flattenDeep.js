import { Map } from 'immutable'

/**
 * Flattens the given Iterable. Returns entries which satisfy the predicate function and
 * applies optional transformations for keys and/or values of the respective Iterable.
 * @param {Iterable} iter
 * @param {Function} predicate
 * @param {boolean} flattenKeys
 * @param {Function} transformValue
 * @param {string[]} nextKeyPath
 * @param {Iterable} nextAcc
 * @returns {Iterable}
 */
export default function flattenDeep(
  iter,
  predicate = null,
  flattenKeys = false,
  transformValue = null,
  transformKey = null,
  nextKeyPath = [],
  nextAcc = Map(),
) {
  return iter.reduce((acc, value, key) => {
    const deepKeyPath = nextKeyPath.concat(key)
    const satisfiesPredicate = predicate
      ? predicate(value, deepKeyPath, acc)
      : true

    if (satisfiesPredicate) {
      const transformedKeyPath = transformKey
        ? [transformKey(deepKeyPath)]
        : deepKeyPath
      const resolvedKeyPath = flattenKeys
        ? [transformedKeyPath.join('.')]
        : transformedKeyPath
      const resolvedValue = transformValue
        ? transformValue(value, deepKeyPath)
        : value

      return acc.setIn(resolvedKeyPath, resolvedValue)
    }

    /**
     * Do not call flatten recursively in case the current value
     * is not an instance of Iterable.
     */
    if (!Map.isMap(value)) {
      return acc
    }

    return flattenDeep(
      value,
      predicate,
      flattenKeys,
      transformValue,
      transformKey,
      deepKeyPath,
      acc,
    )
  }, nextAcc)
}
