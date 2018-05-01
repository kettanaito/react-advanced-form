import type { Map } from 'immutable';

/**
 * Ensures the provided unsafe key paths are set on the fields Map.
 * That means that upon convertion to mutable Object, those unsafe paths would explicitly
 * equal to "undefined", instead of throwing an error.
 * @flow
 */
export default function ensafeMap(originMap: Map<string, any>, keyPaths: string[][]) {
  if (!keyPaths || (keyPaths.length === 0)) {
    return originMap;
  }

  return keyPaths.reduce((safeMap: Map<string, any>, keyPath: string[]) => {
    return safeMap.setIn(keyPath, safeMap.getIn(keyPath));
  }, originMap);
}
