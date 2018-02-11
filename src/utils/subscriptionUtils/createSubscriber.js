export default function createSubscriber(fieldPath) {
  return function (propsList, resolver) {
    return {
      props: Array.isArray(propsList) ? propsList : [propsList],
      fieldPath,
      resolver
    };
  };
}
