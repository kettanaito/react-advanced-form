/**
 * Returns a unified event name for prop change event.
 * @param {Map} fieldProps
 * @param {string} propName
 */
export default function composeEventName({ fieldProps, propName }) {
  return `${fieldProps.get('fieldPath')}_${propName}`;
}
