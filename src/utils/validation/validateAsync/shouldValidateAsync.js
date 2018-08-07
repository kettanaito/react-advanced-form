import allPass from 'ramda/src/allPass'

const hasAsyncRule = ({ fieldProps }) => !!fieldProps.asyncRule
const hasValue = ({ fieldProps }) => !!fieldProps.value
const notValidAsync = ({ fieldProps }) => !fieldProps.validAsync

export default allPass([hasValue, hasAsyncRule, notValidAsync])
