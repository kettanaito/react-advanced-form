import React from 'react'
import { Form } from 'react-advanced-form'
import { Input } from '@examples/fields'
import Button from '@shared/Button'

const formMessages = {
  name: {
    fieldOne: {
      invalid: ({ value }) => `Does "${value}" look like a number to you?`,
    },
    fieldTwo: {
      invalid: ({ value }) =>
        `Does "${value}" look like it has only lower case letters?`,
    },
  },
}

export default class FieldPropsRule extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Field rules</h1>

        <Form ref={(form) => (window.form = form)} messages={formMessages}>
          <Input
            name="fieldOne"
            label="Field one"
            hint="Only numbers allowed"
            rule={/^\d+$/}
          />
          <Input
            name="fieldTwo"
            label="Field two"
            hint="Only lowercase letters allowed"
            rule={/^[a-z]+$/}
            required
          />
        </Form>
      </React.Fragment>
    )
  }
}
