import React from 'react'
import { Form } from '@lib'
import { Input } from '@fields'

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
      <Form ref={this.props.getRef}>
        <Input
          name="fieldOne"
          rule={/^\d+$/}
          asyncRule={this.validateAsync}
          label="Field one"
          hint="Numbers only (sync), not equal to 123 (async)"
        />
      </Form>
    )
  }
}
