import React from 'react'
import { Form, Field } from 'react-advanced-form'
import { Input, Checkbox } from '@examples/fields'
import Button from '@examples/shared/Button'

export default class Reset extends React.Component {
  resetForm = (event) => {
    event.preventDefault()
    window.form.reset()
  }

  resetWithPredicate = (event) => {
    event.preventDefault()
    window.form.reset((fieldProps) =>
      fieldProps.fieldPath.includes('billingAddress'),
    )
  }

  render() {
    const { getRef } = this.props

    return (
      <React.Fragment>
        <h1>Reset</h1>
        <Form
          ref={(form) => {
            window.form = form
            getRef && getRef(form)
          }}
        >
          <Input
            name="username"
            label="Username"
            initialValue="john.doe"
            required
          />
          <Input name="password" type="password" label="Password" required />
          <Field.Group name="billingAddress">
            <Input name="firstName" label="First name" />
          </Field.Group>

          <Checkbox
            name="termsAndConditions"
            label="I agree to Terms and Conditions"
            required
          />

          <Button id="default-reset" type="reset" onClick={this.resetForm}>
            Reset
          </Button>
          <Button
            id="with-predicate"
            type="reset"
            onClick={this.resetWithPredicate}
          >
            Reset with predicate
          </Button>
        </Form>
      </React.Fragment>
    )
  }
}
