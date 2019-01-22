// @flow
/**
 * Calls `console.warn` with the provided message when the condition rejects.
 * @param {boolean} condition
 * @param {string} message
 * @param {any[]} optionalParams
 */
export default function warning(
  condition: mixed,
  message: string,
  ...messageParams: any[]
) {
  if (!condition) {
    console.warn(message, ...messageParams)
  }
}
