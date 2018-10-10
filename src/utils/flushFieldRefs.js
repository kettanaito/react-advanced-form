// @flow
import dispatch from './dispatch'
import createPropGetter from './fieldUtils/createPropGetter'

type FieldRefs = {
  refs: string[][],
  initialValue: mixed,
}

/**
 * Returns the map of flushed field props paths referenced within
 * the provided method, and its initial value.
 */
export default function flushFieldRefs(func: Function, args: mixed): FieldRefs {
  const refs = []

  const initialValue = dispatch(func, {
    ...args,
    get: createPropGetter(args.form.state.fields, (propRefPath) =>
      refs.push(propRefPath),
    ),
  })

  return { refs, initialValue }
}
