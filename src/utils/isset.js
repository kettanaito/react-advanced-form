/**
 * Determines if the provided variable is set.
 * @param {any} variable
 * @return {boolean}
 * @flow
 */
export default function isset(variable: mixed): boolean {
  return (typeof variable !== 'undefined') && (variable !== null);
}
