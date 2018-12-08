import * as R from 'ramda'
import stitchWith from '../stitchWith'

const stitchFields = stitchWith(R.prop('fieldPath'), R.identity)

export default stitchFields
