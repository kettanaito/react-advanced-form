/**
 * Ensures the provided unsafe key paths are set on the fields Map.
 * That means that upon convertion to mutable Object, those unsafe paths would explicitly
 * equal to "undefined", instead of throwing an error.
 */
export default function ensafeMap(originMap, keyPaths) {
  return keyPaths.reduce((safeMap, keyPath) => {
    return safeMap.setIn(keyPath, safeMap.getIn(keyPath));
  }, originMap);
}
