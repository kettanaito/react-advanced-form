import React from 'react'
import { Form } from 'react-advanced-form'
import { Input } from '@examples/fields'
import Button from '@examples/shared/Button'

const validationRules = {
  type: {
    email: {
      oneNumber: ({ value }) => /[0-9]/.test(value),
      capitalLetter: ({ value }) => /[A-Z]/.test(value),
      minLength: ({ value }) => value.length > 5,
    },
  },
}

export default class CombinedValidation extends React.Component {
  validateAsync = ({ value }) => {
    return new Promise((resolve) => {
      setTimeout(resolve, 500)
    }).then(() => {
      return {
        valid: value !== '123',
      }
    })
  }

  render() {
    return (
      <Form ref={(form) => (window.form = form)} rules={validationRules}>
        <Input
          name="fieldOne"
          rule={/^\d+$/}
          asyncRule={this.validateAsync}
          label="Field one"
          hint="Numbers only (sync), not equal to 123 (async)"
        />
        <Input name="userPassword" type="email" label="Password" required />
      </Form>
    )
  }
}
