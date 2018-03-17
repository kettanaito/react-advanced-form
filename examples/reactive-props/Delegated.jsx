import React from 'react';
import { Form } from '@lib';
import { Input } from '@fields';

export default class RxPropsDelegated extends React.Component {
  render() {
    return (
      <Form>
        <Input
          name="firstName"
          label="Fisrt name"
          hint="Required when `lastName` has value"
          required={({ fields }) => {
            return !!fields.lastName.value;
          }} />
        <Input
          name="lastName"
          label="Last name"
          initialValue="foo" />
      </Form>
    );
  }
}
