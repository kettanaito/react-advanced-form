import React from 'react'
import { Form } from '@lib'
import { Input, Checkbox } from '@fields'
import Button from '@shared/Button'

export default class Reset extends React.Component {
  resetForm = () => {
    this.form.reset()
  }

  render() {
    const { getRef } = this.props

    return (
      <React.Fragment>
        <h1>Reset</h1>
        <Form
          ref={(form) => {
            this.form = form
            getRef && getRef(form)
          }}
        >
          <Input name="username" label="Username" initialValue="john.doe" required />
          <Input name="password" type="password" label="Password" required />
          <Input name="firstName" label="First name" />
          <Checkbox
            name="termsAndConditions"
            label="I agree to Terms and Conditions"
            required
          />

          <Button type="reset" onClick={this.resetForm}>
            Reset fields
          </Button>
        </Form>
      </React.Fragment>
    )
  }
}
