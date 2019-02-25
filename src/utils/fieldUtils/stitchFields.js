import * as R from 'ramda'
import stitchWith from '../stitchWith'

export default stitchWith(R.prop('fieldPath'), R.identity)
