// @flow
import dispatch from './dispatch'
import createPropGetter from './fieldUtils/createPropGetter'
import createRuleResolverArgs from './validation/createRuleResolverArgs'

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
  const resolverArgs = createRuleResolverArgs(args)

  const initialValue = dispatch(func, {
    ...resolverArgs,
    get: createPropGetter(args.form.state.fields, (propRefPath) =>
      refs.push(propRefPath),
    ),
  })

  return { refs, initialValue }
}
