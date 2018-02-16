import { Map } from 'immutable';

/* The list of supported dynamic props */
//
//
// TODO It would be great to allow any prop to be a function with the unified
// resolver interface.
//
//
export const supportedRxProps = ['required', 'disabled'];

/**
 * Returns the collection of the dynamic props present on the provided field.
 * @param {object} fieldProps
 * @return {Map}
 */
export default function getRxProps(fieldProps) {
  return supportedRxProps.reduce((props, rxPropName) => {
    const rxPropValue = fieldProps[rxPropName];

    if (typeof rxPropValue === 'function') {
      return props.set(rxPropName, rxPropValue);
    }

    return props;
  }, Map());
}
