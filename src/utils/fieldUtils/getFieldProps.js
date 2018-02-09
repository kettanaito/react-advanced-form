/**
 * Returns the props of the given field based on the presence of its record within the form's state.
 * In case the field is not yet registered, returns the fallback props provided.
 * @param {string} fieldPath
 * @param {Map} fields
 * @param {object} fallbackProps
 */
export default function getFieldProps(fieldPath, fields, fallbackProps) {
  const contextProps = fields.getIn([fieldPath]);
  return contextProps ? contextProps.toJS() : fallbackProps;
}
