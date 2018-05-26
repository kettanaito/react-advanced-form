// @flow
type TFunc = (...args: mixed[]) => mixed

/**
 * Executes the list of functions sequentially, populating the array
 * with the result of the function only when the latter returns something.
 */
export default function listOf(...funcs: TFunc[]) {
  return (...args: mixed[]) => {
    return funcs.reduce((newArr, func) => {
      const res: mixed = func(...args)
      return res ? newArr.concat(res) : newArr
    }, [])
  }
}
