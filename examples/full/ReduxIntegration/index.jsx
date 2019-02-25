import React from 'react'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import { Form, createField, fieldPresets } from 'react-advanced-form'
import { PlainInput } from '@examples/fields/Input'
import { setVatRequired } from './reducers/actions'
import vatReducer from './reducers/vatReducer'

const store = createStore(vatReducer)

const RafInput = createField({
  ...fieldPresets.input,
  mapState: (state, props) => ({
    required: props.isVatRequired,
  }),
})(PlainInput)

const SubscribedInput = connect((state) => ({
  isVatRequired: state.isVatRequired,
}))(RafInput)

const RegistrationForm = (props) => {
  const { setVatRequired, isVatRequired } = props

  return (
    <Form>
      <SubscribedInput name="vatNumber" label="VAT" />

      <button onClick={() => setVatRequired(!isVatRequired)}>
        Toggle VAT required
      </button>
    </Form>
  )
}

const WrappedRegistrationForm = connect(
  (state) => ({
    isVatRequired: state.isVatRequired,
  }),
  { setVatRequired },
)(RegistrationForm)

class ReduxIntegration extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <WrappedRegistrationForm />
      </Provider>
    )
  }
}

export default ReduxIntegration
