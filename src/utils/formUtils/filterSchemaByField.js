// @flow
import * as R from 'ramda'

export type ResolverRecord = {
  keyPath: string[],
  selector: string,
  resolver: Function,
}

const getRulesPaths = (fieldProps: Object) => [
  ['name', fieldProps.name],
  ['type', fieldProps.type],
]

const createRuleRecord = ([resolver, keyPath]): ResolverRecord => ({
  keyPath,
  selector: R.head(keyPath),
  resolver,
})

const projectResolvers = ([resolver, keyPath]) => {
  if (typeof resolver === 'function') {
    return [[resolver, keyPath]]
  }

  return Object.entries(resolver).map(([ruleName, resolver]) => {
    return [resolver, keyPath]
  })
}

/**
 * Returns the list of resolver records from the given validation schema
 * applicable to the given field.
 */
const filterSchemaByField = (
  fieldProps: Object,
  validationSchema: Object,
): ResolverRecord[] =>
  R.compose(
    /* Create rule record from the list of resolvers */
    R.map(createRuleRecord),

    /* Handle and flat map multiple resolvers */
    R.chain(projectResolvers),

    /* Filter out selectors that have no rules */
    R.filter(R.head),

    /* Grab resolvers based on paths from the schema */
    R.map((keyPath) => [R.path(keyPath, validationSchema), keyPath]),
    getRulesPaths,
  )(fieldProps)

export default filterSchemaByField
