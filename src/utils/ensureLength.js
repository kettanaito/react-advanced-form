// @flow
import concat from 'ramda/src/concat'
import repeat from 'ramda/src/repeat'
import subtract from 'ramda/src/subtract'
import length from 'ramda/src/length'

/**
 * Prepends "null" until the length of the given array matches
 * the requested minimal length.
 */
export default function ensureLength(minLength: number) {
  return (arr: any[]) => {
    return concat(repeat(null, subtract(minLength, length(arr))))(arr)
  }
}
