/**
 * Generic enhancer class.
 * Enhancer is an independent extension unit, which enhances the functionality
 * of the wrapped field. It may introduce new props, intercept essential field events
 * and change the payload of the transfered events data to mutate the behavior of the field.
 */
export default class Enhancer {
  interceptors = [];

  intercept(eventName, interceptor) {
    const eventInterceptors = this.interceptors[eventName] || [];
    this.interceptors[eventName] = eventInterceptors.concat(interceptor);

    return this;
  }
}
