/**
 * Write me
 */
export const dynamicProps = ['required', 'disabled'];

export default function getDynamicProps(fieldProps) {
  return dynamicProps.reduce((props, dynamicProp) => {
    const propValue = fieldProps[dynamicProp];

    if (typeof propValue === 'function') {
      props[dynamicProp] = propValue;
    }

    return props;
  }, {});
}
