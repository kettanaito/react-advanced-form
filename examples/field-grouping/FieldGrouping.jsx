import React from 'react'
import { Form, Field } from 'react-advanced-form'
import { Input, Select } from '@examples/fields'

export default class FieldGrouping extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Field grouping</h1>

        <Form ref={(form) => (window.form = form)}>
          <Select name="customerType" initialValue="b2b">
            <option value="b2b">Business</option>
            <option value="b2c">Private</option>
          </Select>

          <Field.Group name="billingAddress">
            <Input name="lastName" initialValue="Maverick" />
          </Field.Group>

          {/* Simple group */}
          <Field.Group name="primaryInfo">
            <Input
              type="email"
              name="email"
              initialValue="john.maverick@email.com"
            />
          </Field.Group>

          <Field.Group name="billingAddress">
            <Input name="firstName" initialValue="John" />

            {/* Nested groups */}
            <Field.Group name="userInfo">
              <Input name="firstName" initialValue="Cathaline" />
            </Field.Group>

            {/* Exact field group */}
            <Field.Group exact name="primaryInfo">
              <Input type="password" name="password" initialValue="123" />
            </Field.Group>
          </Field.Group>
        </Form>
      </React.Fragment>
    )
  }
}
