import * as R from 'ramda'
import getLeavesWhich from '../getLeaves'

/**
 * Accepts an object with deep nested fields and
 * returns a shallow list of that fields.
 */
export default getLeavesWhich(R.has('fieldPath'))
