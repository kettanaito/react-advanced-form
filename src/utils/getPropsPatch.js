const subscribedProps = ['initialValue', 'disabled', 'required'];

export default function getPropsPatch({ contextProps, nextProps }) {
  const nextPropsKeys = Object.keys(nextProps);
  if (!nextProps || nextPropsKeys.length === 0) return {};

  return subscribedProps.reduce((patch, propName) => {
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
