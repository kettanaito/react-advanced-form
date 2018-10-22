import React from 'react'
import { Form, Field } from 'react-advanced-form'
import { Input } from '@fields'
import Button from '@shared/Button'

export default class SetErrors extends React.Component {
  handleFirstButtonClick = (event) => {
    event.preventDefault()

    window.form.setErrors({
      fieldOne: 'foo',
      billingAddress: {
        firstName: 'bar',
      },
    })
  }

  handleSecondButtonClick = (event) => {
    event.preventDefault()

    window.form.setErrors({
      fieldOne: null,
    })
  }

  render() {
    const { getRef } = this.props

    return (
      <Form ref={(form) => (window.form = form)}>
        <Input
          name="fieldOne"
          rule={/^\d+$/}
          label="Field one"
          hint="Numbers only"
        />
        <Field.Group name="billingAddress">
          <Input name="firstName" required />
        </Field.Group>

        <Button id="set-both" onClick={this.handleFirstButtonClick}>
          Set both errors
        </Button>
        <Button id="set-null" onClick={this.handleSecondButtonClick}>
          Set explicit "null"
        </Button>
      </Form>
    )
  }
}
