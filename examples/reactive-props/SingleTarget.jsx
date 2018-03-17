import React from 'react';
import { Form } from '@lib';
import { Input } from '@fields';

export default class RxPropsOneTarget extends React.Component {
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
          label="Last name" />
        <Input
          name="fieldThree"
          label="Some field three"
          hint="Required when `lastName` has value"
          required={({ fields }) => {
            return !!fields.lastName.value;
          }} />
      </Form>
    );
  }
}
