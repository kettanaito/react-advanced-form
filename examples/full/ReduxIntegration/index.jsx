import React from 'react'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import { Form, createField, fieldPresets } from 'react-advanced-form'
import { setVatRequired } from './reducers/actions'
import vatReducer from './reducers/vatReducer'

const store = createStore(vatReducer)

class Input extends React.Component {
  render() {
    const { fieldProps, fieldState, label, isVatRequired } = this.props
    const { required } = fieldState

    return (
      <div>
        {label && (
          <p>
            {label}
            {required && ' *'}
          </p>
        )}
        <input {...fieldProps} />
      </div>
    )
  }
}

const SubscribedInput = connect((state) => ({
  isVatRequired: state.isVatRequired,
}))(Input)
const RafInput = createField({
  ...fieldPresets.input,
  mapState: (props, state) => ({
    required: props.isVatRequired,
  }),
})(SubscribedInput)

const RegistrationForm = (props) => {
  const { setVatRequired, isVatRequired } = props

  return (
    <Form>
      <RafInput name="vatNumber" />
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
