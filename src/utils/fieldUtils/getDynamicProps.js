/* The list of dynamic props */
export const dynamicProps = ['required', 'disabled'];

/**
 * Returns the collection of the dynamic props presents in the provided field.
 * @param {Map} fieldProps
 * @return {object}
 */
export default function getDynamicProps(fieldProps) {
  return dynamicProps.reduce((props, dynamicProp) => {
    const propValue = fieldProps[dynamicProp];

    if (typeof propValue === 'function') {
      props[dynamicProp] = propValue;
    }

    return props;
  }, {});
}
