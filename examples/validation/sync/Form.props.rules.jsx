import React from 'react'
import { Form } from '@lib'
import { Input } from '@fields'

const rules = {
  type: {
    text: ({ value }) => {
      return value.length > 2
    },
  },
  name: {
    fieldOne: ({ value, fieldProps }) => {
      const fieldRef = fieldProps.getRef()
      return value !== 'foo'
    },
    fieldTwo: ({ value, get }) => {
      return value === get(['fieldOne', 'value'])
    },
  },
}

const messages = {
  general: {
    invalid: 'General invalid',
  },
  name: {
    fieldOne: {
      invalid: 'Must not equal to "foo"!',
    },
  },
}

export default class FormPropsRules extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Form rules</h1>
        <Form rules={rules} messages={messages}>
          <Input
            {...this.props}
            name="fieldOne"
            label="Field one"
            hint="Must be more than 2 characters and not equal to `foo`"
          />
          <Input
            name="fieldTwo"
            label="Field two"
            hint="Valid when equals to `fieldOne` value"
          />
        </Form>
      </React.Fragment>
    )
  }
}
