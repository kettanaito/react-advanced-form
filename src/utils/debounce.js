/**
 * Returns a debounced wrapper function over the provided function.
 * @param {function} func
 * @param {number} duration
 * @param {boolean} immediate
 * @return {func}
 * @flow
 */
export default function debounce(func: Function, duration: number, immediate: boolean = false) {
  let timeout;

  return function (...args: mixed[]) {
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
