/**
 * Calls `console.warn` with the provided message when the `testValue` rejects.
 * @param {boolean} testValue
 * @param {string} message
 * @param {any[]} optionalParams
 */
import util from 'util';

export default function warning(testValue, message, ...params) {
  if (!testValue) console.warn(util.format(message, ...params));
}
