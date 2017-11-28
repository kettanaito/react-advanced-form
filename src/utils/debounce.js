export default function debounce(func, wait, immediate) {
  let timeout;

  return function (...args) {
    const context = this;

    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const shouldResolve = (immediate && !timeout);
    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (shouldResolve) func.apply(context, args);
  }
}
