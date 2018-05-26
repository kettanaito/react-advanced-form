// @flow
/**
 * Determines if the provided variable is set.
 */
export default function isset(variable: mixed): boolean {
  return typeof variable !== 'undefined' && variable !== null
}
