import React from 'react';
import { Form, Field } from '@lib';
import { Input, Checkbox } from '@fields';

export default class SplitGroups extends React.Component {
  render() {
    return (
      <Form ref={ this.props.getRef }>
        <Input
          name="email"
          type="email"
          label="E-mail"
          initialValue="john@maverick.com" />

        <Field.Group name="primaryInfo">
          <Input
            name="firstName"
            label="First name"
            initialValue="John" />
          <Input
            name="lastName"
            label="Last name"
            initialValue="Maverick" />

          <Field.Group name="billingAddress">
            <Input
              name="street"
              label="Street"
              initialValue="Sunwell ave." />
          </Field.Group>
        </Field.Group>

        <Input
          name="password"
          type="password"
          label="Password"
          initialValue="super-secret" />

        <Field.Group name="primaryInfo">
          <Checkbox
            name="newsletter"
            label="Subscribe to newsletter"
            checked />

          <Field.Group name="billingAddress">
            <Input
              name="houseNumber"
              label="House number"
              initialValue="3" />
          </Field.Group>
        </Field.Group>

        <Field.Group name="billingAddress">
          <Checkbox
            name="noCollision"
            label="Nesting is important"
            checked />
        </Field.Group>
      </Form>
    );
  }
}
