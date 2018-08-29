import assocPath from 'ramda/src/assocPath'
import toPairs from 'ramda/src/toPairs'
import isset from './isset'

export default function flattenDeep(
  source,
  predicate = () => true,
  flattenKeys = false,
  transformValue = (value) => value,
  transformKey,
  prevKeyPath = [],
  nextAcc = {},
) {
  return toPairs(source).reduce((acc, [key, value]) => {
    if (!isset(value)) {
      return acc
    }

    const deepKeyPath = prevKeyPath.concat(key)
    const satisfiesPredicate = predicate(value, deepKeyPath, acc)

    if (satisfiesPredicate) {
      const transformedKeyPath = transformKey ? [transformKey(deepKeyPath)] : deepKeyPath
      const resolvedKeyPath = flattenKeys ? [transformedKeyPath.join('.')] : transformedKeyPath
      const resolvedValue = transformValue(value, deepKeyPath)

      return assocPath(resolvedKeyPath, resolvedValue, acc)
    }

    // FIXME
    // There was some check to prevent passing instances different from Map
    // down the iteration tree.
    if (!(value instanceof Object)) {
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
