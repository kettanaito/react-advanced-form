/**
 * Returns the props of the given field based on the presence of the latter in the form's state/context.
 * In case the field is not yet registered in the form's state, returns the fallback props provided.
 * @param {string} fieldPath
 * @param {Map} fields
 * @param {object} fallbackProps
 */
export default function getFieldProps(fieldPath, fields, fallbackProps) {
  const contextProps = fields.getIn([fieldPath]);
  return contextProps ? contextProps.toJS() : fallbackProps;
}
