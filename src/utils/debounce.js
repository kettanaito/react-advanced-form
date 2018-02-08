/**
 * Returns a wrapped function with debounce logic built-in.
 * @param {function} func
 * @param {number} duration
 * @param {boolean} immediate
 * @return {func}
 */
export default function debounce(func, duration, immediate = false) {
  let timeout;

  return async function (...args) {
    const context = this;

    const later = function () {
      timeout = null;

      if (!immediate) {
        return func.apply(context, args);
      }
    };

    clearTimeout(timeout);

    timeout = setTimeout(later, duration);

    if (immediate && !timeout) {
      return func.apply(context, args);
    }
  };
}
