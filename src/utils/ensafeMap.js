/**
 * Ensures the provided unsafe key paths are set on the fields Map.
 * That means that upon convertion to mutable Object, those unsafe paths would explicitly
 * equal to "undefined", instead of throwing an error.
 * @param {Map} originMap
 * @param {Array<Array<string>>} keyPaths
 * @returns {Map}
 */
export default function ensafeMap(originMap, keyPaths) {
  if (!keyPaths || (keyPaths.length === 0)) {
    return originMap;
  }

  return keyPaths.reduce((safeMap, keyPath) => {
    return safeMap.setIn(keyPath, safeMap.getIn(keyPath));
  }, originMap);
}
