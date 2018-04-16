/**
 * A thunk to generate a field prop getter function.
 * The latter is used for reactive props implementation and allows to flush
 * field prop references into a single source using a callback function.
 * @param {Map} fields
 * @param {Function} callback
 * @returns {Function} A field prop getter function.
 */
export default function createPropGetter(fields, callback) {
  return (propPath) => {
    /**
     * Getting the value is an internal procedure operating with Immutable fields.
     * This logic is not affected by the "withImmutable" option.
     */
    const propValue = fields.getIn(propPath);

    if (callback) {
      callback(propPath, propValue);
    }

    return propValue;
  };
}
