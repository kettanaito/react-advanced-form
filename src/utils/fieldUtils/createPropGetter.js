/**
 * Generates a field prop getter function.
 * The latter is used for reactive props implementation and allows to flush
 * field prop references into a single source using a callback function.
 * @param {Map} fields
 * @param {Function} callback
 */
export default function createPropGetter(fields, callback) {
  return (propPath) => {
    const propValue = fields.getIn(propPath);

    if (callback) {
      callback(propPath, propValue);
    }

    return propValue;
  };
}
