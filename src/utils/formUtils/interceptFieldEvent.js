import isset from '../isset';

/**
 * Applies present interceptors of the field to provided event name.
 * @param {string} eventName
 * @param {Object} eventData
 * @returns {Object} Intercepted event data.
 */
export default function interceptFieldEvent(eventName, eventData) {
  const field = eventData.ref;
  if (!isset(field)) {
    return;
  }

  const { enhancers: fieldEnhancers } = field.context;

  /* Bypass fields without enhancers */
  if (!isset(fieldEnhancers)) {
    return eventData;
  }

  return fieldEnhancers.reduce((nextEventData, enhancer) => {
    const eventInterceptors = enhancer.interceptors[eventName];

    if (!isset(eventInterceptors)) {
      return nextEventData;
    }

    return eventInterceptors.reduce((interceptedEventData, interceptor) => {
      return interceptor(interceptedEventData);
    }, nextEventData);
  }, eventData);
}
