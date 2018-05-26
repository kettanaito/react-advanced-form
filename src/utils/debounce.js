// @flow
/**
 * Returns a debounced wrapper function over the provided function.
 */
export default function debounce(
  func: Function,
  duration: number,
  immediate: boolean = false,
) {
  let timeout

  return function(...args: mixed[]) {
    const context = this

    return new Promise((resolve) => {
      const later = function() {
        timeout = null

        if (!immediate) {
          resolve(func.apply(context, args))
        }
      }

      clearTimeout(timeout)
      timeout = setTimeout(later, duration)

      if (immediate && !timeout) {
        resolve(func.apply(context, args))
      }
    })
  }
}
