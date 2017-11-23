/**
 * Serializes the provided fields Object into a { fieldName: fieldValue } pair.
 */
export default function serialize(fields) {
  return fields.mapEntries(([fieldName, fieldProps]) => {
    const fieldValue = fieldProps.get('value');
    if (fieldValue !== '') return [fieldName, fieldValue];
  });
}
