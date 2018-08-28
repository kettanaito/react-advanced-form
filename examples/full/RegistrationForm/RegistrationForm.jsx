import React from 'react'
import { Form, Field } from '@lib'
import { Input } from '@fields'
import Button from '@shared/Button'

export default class RegistrationForm extends React.Component {
  registerUser = ({ serialized }) => {
    console.log(serialized)
    return new Promise(resolve => resolve())
  }

  render() {
    return (
      <React.Fragment>
        <h1>Registration form</h1>
        <Form action={this.registerUser}>
          <Field.Group name="primaryInfo">
            <Input name="userEmail" type="email" label="E-mail" required />
          </Field.Group>

          <Input name="userPassword" type="password" label="Password" required />
          <Input name="confirmPassword" type="password" label="Confirm password" required />

          <Field.Group name="primaryInfo">
            <Input
              name="firstName"
              label="First name"
              required={({ fields }) => {
                return !!fields.primaryInfo.lastName.value
              }}
            />
            <Input
              name="lastName"
              label="Last name"
              required={({ fields }) => {
                return !!fields.primaryInfo.firstName.value
              }}
            />
          </Field.Group>

          <Button>Register</Button>
        </Form>
      </React.Fragment>
    )
  }
}
