import { Map } from 'immutable';

/* The list of dynamic props */
export const dynamicProps = ['required', 'disabled'];

/**
 * Returns the collection of the dynamic props presents in the provided field.
 * @param {object} fieldProps
 * @return {Map}
 */
export default function getDynamicProps(fieldProps) {
  return dynamicProps.reduce((props, dynamicProp) => {
    const propValue = fieldProps[dynamicProp];

    if (typeof propValue === 'function') {
      return props.set(dynamicProp, propValue);
    }

    return props;
  }, Map());
}
