/**
 * Calls `console.warn` with the provided message when the condition rejects.
 * @param {boolean} condition
 * @param {string} message
 * @param {any[]} optionalParams
 */
export default function warning(condition, message, ...params) {
  if (!condition) {
    let paramIndex = 0;
    console.warn(message.replace(/%s/g, () => params[paramIndex++]));
  }
}
