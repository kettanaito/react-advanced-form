// import anyPass from 'ramda/src/anyPass'
import allPass from 'ramda/src/allPass'

// const isForced = (resolverArgs, force) => force

// Field is not valid sync if it doesn't require sync validation.
// FIX THIS
const hasAsyncRule = ({ fieldProps }) => !!fieldProps.asyncRule
const isValidSync = ({ fieldProps }) => fieldProps.validSync
const notValidAsync = ({ fieldProps }) => !fieldProps.validAsync

// export default anyPass([
//   // isForced,
//   allPass([isValidSync, hasAsyncRule, notValidAsync])
// ])

export default allPass([hasAsyncRule, isValidSync, notValidAsync])
