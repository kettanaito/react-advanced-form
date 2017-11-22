/**
 * Serializes the provided fields Object into a { fieldName: fieldValue } pair.
 */
export default function serialize(fields) {
  return fields.mapEntries(([fieldName, fieldProps]) => {
    return [fieldName, fieldProps.get('value')];
  });
}
