import allPass from 'ramda/src/allPass'

const hasAsyncRule = ({ fieldProps }) => !!fieldProps.asyncRule
const notValidAsync = ({ fieldProps }) => !fieldProps.validAsync

export default allPass([hasAsyncRule, notValidAsync])
