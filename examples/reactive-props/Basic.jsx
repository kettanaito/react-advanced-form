import React from 'react';
import { Form } from '@lib';
import { Input } from '@fields';

export default class RxPropsBasic extends React.Component {
  render() {
    return (
      <Form>
        <Input
          name="firstName"
          label="First name"
          initialValue="John" />
        <Input
          name="lastName"
          label="Last name"
          hint="Required when `firstName` has value"
          required={({ fields }) => {
            return !!fields.firstName.value;
          }} />
      </Form>
    );
  }
}
