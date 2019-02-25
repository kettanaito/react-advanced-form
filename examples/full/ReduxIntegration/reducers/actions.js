export const SET_VAT_REQUIRED = 'SET_VAT_REQUIRED'

export const setVatRequired = (nextValue) => ({
  type: SET_VAT_REQUIRED,
  payload: {
    nextValue,
  },
})
