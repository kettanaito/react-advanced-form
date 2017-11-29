/**
 * Returns a wrapped function with debounce logic built-in.
 * @param {function} func
 * @param {number} duration
 * @param {boolean} immediate
 * @return {func}
 */
export default function debounce(func, duration, immediate) {
  let timeout;

  return function (...args) {
    const context = this;

    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const shouldResolve = (immediate && !timeout);
    clearTimeout(timeout);
    timeout = setTimeout(later, duration);

    if (shouldResolve) func.apply(context, args);
  };
}
