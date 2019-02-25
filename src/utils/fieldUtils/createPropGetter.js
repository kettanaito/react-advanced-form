// @flow
import * as R from 'ramda'

type PropKeyPath = string[]
type CreatePropGetterCallback = (
  propKeyPath: PropKeyPath,
  propValue: mixed,
) => void

/**
 * A thunk to generate a field prop getter function.
 * The latter is used for reactive props implementation and allows to flush
 * field prop references into a single source using a callback function.
 */
export default function createPropGetter(
  fields: Object,
  callback: CreatePropGetterCallback,
) {
  return (propKeyPath: PropKeyPath): mixed => {
    const propValue = R.path(propKeyPath, fields)

    if (callback) {
      callback(propKeyPath, propValue)
    }

    return propValue
  }
}
