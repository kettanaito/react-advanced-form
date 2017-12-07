import React from 'react';
import { Form, Field, Condition } from '../lib';
import MyInput from './templates/MyInput';

const validationMessages = {
  general: {
    missing: 'Missing',
    invalid: 'Wrong value'
  }
};

export default class ControlledForm extends React.Component {
  state = {
    username: '',
    password: ''
  }

  render() {
    const { username, password } = this.state;

    return (
      <Form messages={ validationMessages }>
        <div>
          <label>
            Username:
            <MyInput
              name="username"
              value={ username }
              onChange={({ nextValue }) => this.setState({ username: nextValue })}
              required />
          </label>
        </div>

        <div>
          <label>
            Password:
            <MyInput
              name="password"
              value={ password }
              onChange={({ nextValue }) => this.setState({ password: nextValue })}
              required />
          </label>
        </div>

        <button type="submit">Submit</button>
      </Form>
    );
  }
}