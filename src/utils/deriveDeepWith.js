// @flow
import * as R from 'ramda'
import deriveWith from './deriveWith'

const deriveDeepWith = R.curry((fn: Function, lObj: Object, rObj: Object) => {
  return deriveWith(
    (key, lVal, rVal) => {
      if ([R.type(lVal), R.type(rVal)].every(R.equals('Object'))) {
        return deriveDeepWith(fn, lVal, rVal)
      }

      return fn(key, lVal, rVal)
    },
    lObj,
    rObj,
  )
})

export default deriveDeepWith
