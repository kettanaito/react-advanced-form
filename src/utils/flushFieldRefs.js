// @flow
import dispatch from './dispatch'
import createPropGetter from './fieldUtils/createPropGetter'

type TFieldRefs = {
  refs: string[][],
  initialValue: mixed,
}

/**
 * Returns the map of flushed field props paths referenced within
 * the provided method, and its initial value.
 */
export default function flushFieldRefs(func: Function, args: mixed): TFieldRefs {
  const refs = []
  const fieldPropGetter = createPropGetter(args.fields, (propRefPath) =>
    refs.push(propRefPath),
  )

  const initialValue = dispatch(func, {
    ...args,
    get: fieldPropGetter,
  })

  return { refs, initialValue }
}
