import React from 'react'
import { Form } from '@lib'
import { Input } from '@fields'

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
      <Form ref={this.props.getRef} messages={formMessages}>
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
    )
  }
}
