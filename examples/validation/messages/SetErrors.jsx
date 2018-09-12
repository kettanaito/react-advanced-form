import React from 'react'
import { Form, Field } from '@lib'
import { Input } from '@fields'
import Button from '@shared/Button'

export default class SetErrors extends React.Component {
  handleButtonClick = (event) => {
    event.preventDefault()

    this.form.setErrors({
      fieldOne: 'foo',
      billingAddress: {
        firstName: 'bar',
      },
    })
  }

  handleSecondButtonClick = (event) => {
    event.preventDefault()

    this.form.setErrors({
      fieldOne: null,
    })
  }

  render() {
    const { getRef } = this.props

    return (
      <Form
        ref={(form) => {
          this.form = form
          getRef && getRef(form)
        }}
      >
        <Input
          name="fieldOne"
          rule={/^\d+$/}
          label="Field one"
          hint="Numbers only"
        />
        <Field.Group name="billingAddress">
          <Input name="firstName" required />
        </Field.Group>

        <Button id="btn-first" onClick={this.handleButtonClick}>
          Set both errors
        </Button>
        <Button id="btn-second" onClick={this.handleSecondButtonClick}>
          Set explicit "null"
        </Button>
      </Form>
    )
  }
}
