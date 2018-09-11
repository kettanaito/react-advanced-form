import path from 'ramda/src/path'

/**
 * A thunk to generate a field prop getter function.
 * The latter is used for reactive props implementation and allows to flush
 * field prop references into a single source using a callback function.
 * @param {Object} fields
 * @param {Function?} callback
 * @returns {Function} A field prop getter function.
 */
export default function createPropGetter(fields, callback) {
  return (propPath) => {
    const propValue = path(propPath, fields)

    if (callback) {
      callback(propPath, propValue)
    }

    return propValue
  }
}
