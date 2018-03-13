import { Map } from 'immutable';

/**
 * Flattens the given Iterable. Returns entries which satisfy the predicate function and
 * applies optional transformations for keys and values of the returned Iterable.
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
  nextKeyPath = [],
  nextAcc = Map()
) {
  return iter.reduce((acc, value, key) => {
    const deepKeyPath = nextKeyPath.concat(key);
    const satisfiesPredicate = predicate ? predicate(value, deepKeyPath) : true;

    if (satisfiesPredicate) {
      const resolvedKey = flattenKeys ? [deepKeyPath.join('.')] : deepKeyPath;
      const resolvedValue = transformValue ? transformValue(value) : value;
      return acc.setIn(resolvedKey, resolvedValue);
    }

    return flattenDeep(value, predicate, flattenKeys, transformValue, deepKeyPath, acc);
  }, nextAcc);
}
