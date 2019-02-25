// @flow
import * as R from 'ramda'

/**
 * Prepends "null" until the length of the given array matches
 * the given length.
 */
export default function ensureLength(minLength: number) {
  return (arr: any[]) => {
    return R.concat(R.repeat(null, R.subtract(minLength, R.length(arr))))(arr)
  }
}
