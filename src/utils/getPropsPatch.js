/**
 * Get props patch.
 * Returns the diff patch of the exact subscribed props between immutable context props
 * and mutable direct nextProps. Used during the Field receive props lifecycle method.
 * @param {Map} contextProps
 * @param {object} nextProps
 * @return {object}
 */
const subscribedProps = ['initialValue', 'disabled'];

export default function getPropsPatch({ contextProps, nextProps }) {
  if (!nextProps) return {};

  const nextPropsKeys = Object.keys(nextProps);
  if (nextPropsKeys.length === 0) return {};

  return subscribedProps.reduce((patch, propName) => {
    if (!nextProps.hasOwnProperty(propName)) return patch;

    const prevValue = contextProps.get(propName);
    const nextValue = nextProps[propName];

    if (nextValue !== prevValue) {
      patch[propName] = nextValue;

      /* Ensure "initialValue" updates are propagated to the actual "value" */
      if (propName === 'initialValue') patch.value = nextValue;
    }

    return patch;
  }, {});
}
