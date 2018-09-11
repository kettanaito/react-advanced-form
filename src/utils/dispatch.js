// @flow
/**
 * Dispatches the given function when the following exists.
 * Returns the return of the given function.
 */
const dispatch = (func: Function, args: Object) => func && func(args)

export default dispatch
