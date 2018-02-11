/**
 * Returns a "subscribe" function, which returns a unified Subscription interface Object.
 * @param {string} fieldPath Path of the subscribed field.
 * @return {Function<Object>}
 */
export default function createSubscription(fieldPath) {
  return function (props, resolver) {
    return {
      props: Array.isArray(props) ? props : [props],
      fieldPath,
      resolver
    };
  };
}
