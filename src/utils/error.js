// @flow
/**
 * Calls `console.error` with the provided message when the condition rejects.
 * @param {boolean} condition
 * @param {string} message
 * @param {any[]} optionalParams
 */
export default function error(
  condition: mixed,
  message: string,
  ...messageParams: any[]
) {
  if (!condition) {
    console.error(message, ...messageParams)
  }
}
