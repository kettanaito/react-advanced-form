// @flow
import concat from 'ramda/src/concat'
import repeat from 'ramda/src/repeat'
import subtract from 'ramda/src/subtract'
import length from 'ramda/src/length'

/**
 * Ensures the given array is at least of the minimum length.
 * Prepends "null" until the length matches.
 */
const ensureLength = (minLength: number) => {
  return (arr: any[]) => {
    return concat(repeat(null, subtract(minLength, length(arr))))(arr)
  }
}

export default ensureLength
