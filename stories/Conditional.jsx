import React from 'react';
import { Form, Field, Condition } from '../src';
import { MyInput } from './custom-fields';

export default class Conditional extends React.Component {
  render() {
    return (
      <Form messages={{
        general: {
          missing: 'Please provide the required field.',
          invalid: 'The value you have provided is invalid.'
        },
        name: {
          username: {
            missing: 'Please provide the username.',
            invalid: 'Please enter only letters.',
            async: {
              notRegistered: ({ value: username }) => {
                return `User "${username}" is not registered.`;
              }
            }
          }
        }
      }}>
        <p>Type a valid username and it will render the "password" field based on the username's async validation status.</p>
        <Field.Group name="primaryInfo">
          <label>
            Username:
            <MyInput
              name="username"
              rule={/^[a-zA-Z]+$/}
              asyncRule={({ value: username }) => {
                return new Promise(resolve => resolve({
                  valid: (username === 'admin'),
                  someProperty: 'someValue'
                }));

                // return fetch('http://www.mocky.io/v2/5a1d8ee02e0000fc3848b8f2', {
                //   method: 'POST',
                //   body: JSON.stringify({ username })
                // })
                // .then(res => res.json())
                // .then((response) => {
                //   return {
                //     valid: (username === 'admin'),
                //     someProperty: 'someValue'
                //   };
                // }).catch(console.log);
              }}
              required />
          </label>
        </Field.Group>

        <Condition when={({ fields }) => {
          return fields.primaryInfo && fields.primaryInfo.username.validAsync
        }}>
          <label>
            Password:
            <MyInput
              name="password"
              rule={({ value }) => (value.length > 5)}
              required />
          </label>
        </Condition>
      </Form>
    );
  }
}