import * as R from 'ramda'
import getLeavesWhich from '../getLeavesWhich'

/**
 * Accepts an object with deep nested fields and
 * returns a shallow list of that fields.
 */
export default getLeavesWhich(R.has('fieldPath'))
