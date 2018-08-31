import * as R from 'ramda'
import getLeavesWhich from '../getLeaves'

/**
 * Accepts an object with dynamic nesting depth and
 * returns the list of fields present in that object.
 */
export default getLeavesWhich(R.has('fieldPath'))
