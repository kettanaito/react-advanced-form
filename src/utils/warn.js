/**
 * Calls `console.warn` with the provided message when the `testValue` rejects.
 * @param {boolean} testValue
 * @param {string} message
 * @param {any[]} optionalParams
 */
export default function warn(testValue, message, ...optionalParams) {
  if (!testValue) console.warn(message, ...optionalParams);
}
