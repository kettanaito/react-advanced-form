import initialState from './initialState'
import * as actions from './actions'

export default function vatReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_VAT_REQUIRED:
      return { isVatRequired: action.payload.nextValue }

    default:
      return state
  }
}
