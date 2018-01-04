/**
 * Returns the verbose name of the provided React component.
 * @param {React.ReactElement} Component
 * @return {string}
 */
export default function getComponentName(Component) {
  return Component.displayName || Component.name || 'Component';
}
