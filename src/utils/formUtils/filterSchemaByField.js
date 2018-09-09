import * as R from 'ramda'

const getRulesPaths = (fieldProps) => [
  ['name', fieldProps.name],
  ['type', fieldProps.type],
]

/**
 * Returns the list of validators applicable to the given field.
 * @param {Object} fieldProps
 * @param {Object} validationSchema
 * @returns {Function[]}
 */
const filterSchemaByField = (fieldProps, validationSchema) =>
  R.compose(
    R.map(([resolver, keyPath]) => ({
      keyPath,
      selector: R.head(keyPath),
      resolver,
    })),
    R.filter(R.head),
    R.map((keyPath) => [R.path(keyPath, validationSchema), keyPath]),
    getRulesPaths,
  )(fieldProps)

export default filterSchemaByField
