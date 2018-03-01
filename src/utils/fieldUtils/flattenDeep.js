import { Map } from 'immutable';

/**
 * Flattens the given Iterable using deep entries analyzis. Returns entries which satisfy the predicate function.
 * Applies optional transformations for keys and values of the returned Iterable.
 * @param {Iterable} iter
 * @param {Function} predicate
 * @param {boolean} flattenKeys
 * @param {Function} transformValue
 * @param {Iterable} acc
 */
export default function flattenDeep(iter, predicate = null, flattenKeys = false, transformValue = null, acc = Map()) {
  return iter.reduce((acc, entry) => {
    const fieldPath = entry.get('fieldPath');

    if (fieldPath) {
      const satisfiesPredicate = predicate ? predicate(entry) : true;
      if (!satisfiesPredicate) return acc;

      const keyPath = flattenKeys ? [fieldPath.join('.')] : fieldPath;
      const value = transformValue ? transformValue(entry) : entry;

      return acc.setIn(keyPath, value);
    }

    return flattenDeep(entry, predicate, flattenKeys, transformValue, acc);
  }, acc);
}
