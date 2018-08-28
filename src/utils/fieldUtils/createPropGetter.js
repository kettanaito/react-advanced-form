/**
 * A thunk to generate a field prop getter function.
 * The latter is used for reactive props implementation and allows to flush
 * field prop references into a single source using a callback function.
 * @param {Map} fields
 * @param {Function?} callback
 * @returns {Function} A field prop getter function.
 */
export default function createPropGetter(fields, callback) {
  return (propPath) => {
    /**
     * Internally, "fields" are always Immutable Map and are not affected
     * by the form context options.
     */
    const propValue = fields.getIn(propPath)

    if (callback) {
      callback(propPath, propValue)
    }

    return propValue
  }
}
