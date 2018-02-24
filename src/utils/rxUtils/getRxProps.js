//
//
// TODO It would be great to allow any prop to be a function with the unified
// resolver interface.
//
//
/* The list of supported dynamic props */
export const supportedRxProps = ['required'];

/**
 * Returns the collection of the reactive props present on the provided field.
 * @param {Map} fieldProps
 * @returns {Map}
 */
export default function getRxProps(fieldProps) {
  return fieldProps.filter((_, propName) => {
    return (supportedRxProps.includes(propName)) && (typeof fieldProps.get(propName) === 'function');
  });
}
