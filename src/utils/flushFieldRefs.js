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
export default function flushFieldRefs(
  method: Function,
  methodArgs: mixed,
): TFieldRefs {
  const { fields, form } = methodArgs
  const refs = []
  const fieldPropGetter = createPropGetter(fields, (propRefPath) =>
    refs.push(propRefPath),
  )

  const initialValue = dispatch(
    method,
    {
      ...methodArgs,
      get: fieldPropGetter,
    },
    form.context,
  )

  return { refs, initialValue }
}
