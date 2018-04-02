import React from 'react';
import { Form, Field } from '@lib';
import { Input } from '@fields';

export default class RegistrationForm extends React.Component {
  state = {
    type: 'text'
  }

  registerUser = ({ serialized }) => {
    console.log(serialized);
    return new Promise(resolve => resolve());
  }

  render() {
    const { type } = this.state;

    return (
      <Form action={ this.registerUser }>
        <Field.Group name="primaryInfo">
          <Input
            name="userEmail"
            type="email"
            label="E-mail"
            required />
        </Field.Group>

        <button onClick={(event) => {
          event.preventDefault();
          this.setState(({ type }) => ({ type: (type === 'text') ? 'password' : 'text' }));
        }}>Toggle type</button>

        <Input
          name="userPassword"
          type={ type }
          label="Password"
          required />
        <Input
          name="confirmPassword"
          type="password"
          label="Confirm password"
          required />

        <Field.Group name="primaryInfo">
          <Input
            name="firstName"
            label="First name"
            required={({ fields }) => {
              return !!fields.primaryInfo.lastName.value;
            }} />
          <Input
            name="lastName"
            label="Last name"
            required={({ fields }) => {
              return !!fields.primaryInfo.firstName.value;
            }} />
        </Field.Group>

        <button>Register</button>
      </Form>
    );
  }
}
