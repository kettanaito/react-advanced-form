/* The list of all props which may be dynamic */
export const dynamicProps = ['required', 'disabled'];

/**
 * Returns the collection of the present dynamic props in the provided field.
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
