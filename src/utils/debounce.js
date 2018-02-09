/**
 * Returns a debounced wrapper function over the provided function.
 * @param {function} func
 * @param {number} duration
 * @param {boolean} immediate
 * @return {func}
 */
export default function debounce(func, duration, immediate = false) {
  let timeout;

  return function (...args) {
    const context = this;

    return new Promise((resolve) => {
      const later = function () {
        timeout = null;

        if (!immediate) {
          resolve(func.apply(context, args));
        }
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, duration);

      if (immediate && !timeout) {
        resolve(func.apply(context, args));
      }
    });
  };
}
