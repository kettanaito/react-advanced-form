// @flow
import * as R from 'ramda'

export type ResolverRecord = {
  name?: string,
  keyPath: string[],
  selector: string,
  resolver: Function,
}

type ResolverTuple = [Function, string[], string]

const getRulesPaths = (fieldProps: Object) => [
  ['name', fieldProps.name],
  ['type', fieldProps.type],
]

const createResolverRecord = ([
  resolver,
  keyPath,
  ruleName,
]: ResolverTuple): ResolverRecord => ({
  name: ruleName,
  keyPath,
  selector: R.head(keyPath),
  resolver,
})

const projectResolvers = ([resolver, keyPath]: ResolverTuple) => {
  if (typeof resolver === 'function') {
    return [[resolver, keyPath]]
  }

  return Object.entries(resolver).map(([ruleName, namedResolver]) => {
    return [namedResolver, keyPath, ruleName]
  })
}

/**
 * Returns the list of resolver records from the given validation schema
 * applicable to the given field.
 */
const filterSchemaByField = R.curry(
  (validationSchema: Object, fieldProps: Object): ResolverRecord[] =>
    R.compose(
      /* Create the list of resolver records from the list of resolvers */
      R.map(createResolverRecord),

      /* Flat map multiple resolvers */
      R.chain(projectResolvers),

      /* Filter out selectors that have no resolvers */
      R.filter(R.head),

      /* Grab resolvers based on the paths from the schema */
      R.map((keyPath) => [R.path(keyPath, validationSchema), keyPath]),
      getRulesPaths,
    )(fieldProps),
)

export default filterSchemaByField
