/**
 * Gets the reference path of the field within the form's state/context.
 * Field's path includes field's group, when the latter is wrapping the field in the markup.
 * @param {string} name
 * @param {?string} fieldGroup
 * @return {string}
 */
export default function getFieldPath({ name, fieldGroup }) {
  return fieldGroup ? [fieldGroup, name] : [name];
}
