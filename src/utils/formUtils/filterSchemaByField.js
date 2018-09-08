import * as R from 'ramda'

const getRulesPaths = (fieldProps) => [
  ['name', fieldProps.name],
  ['type', fieldProps.type],
]

// const hasFunctionalRule = (fieldProps) => () =>
//   R.allPass([R.complement(R.isNil), R.is(Function)])

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
    // R.when(
    //   hasFunctionalRule(fieldProps.rule),
    //   R.prepend([fieldProps.rule, ['fieldProps', 'rule']]),
    // ),
    R.map((keyPath) => [R.path(keyPath, validationSchema), keyPath]),
    getRulesPaths,
  )(fieldProps)

export default filterSchemaByField
