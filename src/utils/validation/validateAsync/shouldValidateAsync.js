import allPass from 'ramda/src/allPass'

const hasAsyncRule = ({ fieldProps }) => {
  return !!fieldProps.asyncRule
}

const hasValue = ({ fieldProps }) => {
  return !!fieldProps.value
}

const validSync = ({ fieldProps }) => {
  return fieldProps.validatedSync ? fieldProps.validSync : true
}

const notValidAsync = ({ fieldProps }) => {
  return !fieldProps.validAsync
}

export default allPass([hasValue, hasAsyncRule, validSync, notValidAsync])
