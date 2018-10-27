import React from 'react'
import { Form, Field } from 'react-advanced-form'
import { Input } from '@examples/fields'
import Button from '@examples/shared/Button'

export default class SetErrors extends React.Component {
  handleFirstButtonClick = (event) => {
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
          return getRef && getRef(form)
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

        <Button id="btn-first" onClick={this.handleFirstButtonClick}>
          Set both errors
        </Button>
        <Button id="btn-second" onClick={this.handleSecondButtonClick}>
          Set explicit "null"
        </Button>
      </Form>
    )
  }
}
