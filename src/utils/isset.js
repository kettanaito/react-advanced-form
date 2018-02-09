/**
 * Determines if the provided variable is set.
 * @param {any} variable
 * @return {boolean}
 */
export default function isset(variable) {
  return (typeof variable !== 'undefined') && (variable !== null);
}
