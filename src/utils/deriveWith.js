// @flow
import * as R from 'ramda'

const deriveWith = R.curry((fn: Function, lObj: Object, rObj: Object) => {
  return Object.keys(lObj).reduce((result, key) => {
    return lObj.hasOwnProperty(key) && rObj.hasOwnProperty(key)
      ? R.assoc(key, fn(key, lObj[key], rObj[key]), result)
      : result
  }, {})
})

export default deriveWith
