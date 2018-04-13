/**
 * Generic enhancer class.
 * Enhancer is an independent extension unit, which enhances the functionality
 * of the wrapped field. It may introduce new props, intercept essential field events
 * and change the payload of the transfered events data to mutate the behavior of the field.
 */
export default class Enhancer {
  interceptors = [];

  /**
   * Adds a custom mapping function to the provided event name.
   * @param {string} eventName The name of the event to intercept.
   * @param {Function} interceptor The handler of the intercepted event.
   */
  intercept(eventName, interceptor) {
    const eventInterceptors = this.interceptors[eventName] || [];
    this.interceptors[eventName] = eventInterceptors.concat(interceptor);

    return this;
  }
}
