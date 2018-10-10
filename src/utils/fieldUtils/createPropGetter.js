// @flow
import * as R from 'ramda'

type PropPath = string[]
type CreatePropGetterCallback = (propPath: PropPath, propValue: mixed) => void

/**
 * A thunk to generate a field prop getter function.
 * The latter is used for reactive props implementation and allows to flush
 * field prop references into a single source using a callback function.
 */
export default function createPropGetter(
  fields: Object,
  callback: CreatePropGetterCallback,
) {
  return (propPath: PropPath): mixed => {
    const propValue = R.path(propPath, fields)

    if (callback) {
      callback(propPath, propValue)
    }

    return propValue
  }
}
