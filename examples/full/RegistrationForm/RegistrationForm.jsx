import React from 'react'
import { Form, Field } from 'react-advanced-form'
import { Input } from '@fields'
import BirthDate from '../../fields/BirthDate'
import Button from '@shared/Button'

export default class RegistrationForm extends React.Component {
  registerUser = ({ serialized }) => {
    console.log(serialized)
    return new Promise((resolve) => resolve())
  }

  render() {
    return (
      <React.Fragment>
        <h1>Registration form</h1>

        <Form action={this.registerUser}>
          <Field.Group name="primaryInfo">
            <Input name="userEmail" type="email" label="E-mail" required />
          </Field.Group>

          <BirthDate name="birthDate" label="Birth date" required />

          <Input
            name="userPassword"
            type="password"
            label="Password"
            required
          />
          <Input
            name="confirmPassword"
            type="password"
            label="Confirm password"
            required
          />

          <Field.Group name="primaryInfo">
            <Input
              name="firstName"
              label="First name"
              required={({ get }) => {
                return !!get(['primaryInfo', 'lastName', 'value'])
              }}
            />
            <Input
              name="lastName"
              label="Last name"
              required={({ get }) => {
                return !!get(['primaryInfo', 'firstName', 'value'])
              }}
            />
          </Field.Group>

          <Button>Register</Button>
        </Form>
      </React.Fragment>
    )
  }
}
