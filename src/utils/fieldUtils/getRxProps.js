import { Map } from 'immutable';

/* The list of supported dynamic props */
//
//
// TODO It would be great to allow any prop to be a function with the unified
// resolver interface.
//
//
export const supportedReactiveProps = ['required', 'disabled'];

/**
 * Returns the collection of the dynamic props present on the provided field.
 * @param {object} fieldProps
 * @return {Map}
 */
export default function getReactiveProps(fieldProps) {
  return supportedReactiveProps.reduce((props, dynamicProp) => {
    const propValue = fieldProps[dynamicProp];

    if (typeof propValue === 'function') {
      return props.set(dynamicProp, propValue);
    }

    return props;
  }, Map());
}
