import React from 'react'
import { Form, Field } from 'react-advanced-form'
import { Input, BirthDate } from '@examples/fields'
import Button from '@examples/shared/Button'

const customRules = {
  extends: false,
  name: {
    userEmail: ({ value }) => value === 'foo',
  },
}

export default class RegistrationForm extends React.Component {
  state = {
    isLocal: false,
  }

  registerUser = ({ serialized }) => {
    console.log(serialized)
    return new Promise((resolve) => resolve())
  }

  render() {
    const { isLocal } = this.state
    const rules = isLocal ? customRules : null

    return (
      <React.Fragment>
        <h1>Registration form</h1>

        <Form
          ref={(form) => (this.form = form)}
          action={this.registerUser}
          rules={rules}
        >
          <Field.Group name="primaryInfo">
            <Input name="userEmail" type="email" label="E-mail" required />
          </Field.Group>

          <BirthDate
            name="birthDate"
            label="Birth date"
            date="1980-12-10"
            required
          />

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
            skip
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
          <button type="reset" onClick={() => this.form.clear()}>
            Clear
          </button>

          <Button
            onClick={() =>
              this.setState(({ isLocal }) => ({
                isLocal: !isLocal,
              }))
            }
          >
            Change rules
          </Button>
        </Form>
      </React.Fragment>
    )
  }
}
