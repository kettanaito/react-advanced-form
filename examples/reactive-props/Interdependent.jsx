import React from 'react';
import { Form } from '@lib';
import { Input } from '@fields';

export default class RxPropsInterdependent extends React.Component {
  render() {
    return (
      <Form>
        <Input
          name="firstName"
          label="First name"
          hint="Required when `lastName` has value"
          required={({ fields }) => {
            return !!fields.lastName.value;
          }} />
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
