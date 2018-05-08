/**
 * Calls `console.warn` with the provided message when the condition rejects.
 * @param {boolean} condition
 * @param {string} message
 * @param {any[]} optionalParams
 * @flow
 */
export default function warning(condition: mixed, message: string, ...params: any[]) {
  if (!condition) {
    let paramIndex = 0
    console.warn(message.replace(/%s/g, () => params[paramIndex++]))
  }
}
