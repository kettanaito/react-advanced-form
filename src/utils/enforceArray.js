/**
 * @flow
 * Returns an Array of the given variable, bypassing the
 * scenario when the latter is already an Array.
 */
export default function enforceArray(variable: any[] | any): any[] {
  return [].concat(variable)
}
