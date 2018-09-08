import * as R from 'ramda'

const stitchBy = R.curry((keyPath, list) => {
  return R.reduce((acc, entry) => {
    const prevValues = R.path(keyPath, acc) || []
    const nextValues = prevValues.concat(entry)
    return R.assocPath(R.path(keyPath, entry), nextValues, acc)
  }, {})(list)
})

export default stitchBy
