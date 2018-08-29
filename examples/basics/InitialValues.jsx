import React from 'react'
import { fieldPresets, createField, Form, Field } from '@lib'
import { Input } from '@fields'
import { Select } from '@examples/fields/Select'
import Button from '@shared/Button'

const OccupattionSelect = createField({
  ...fieldPresets.select,
  initialValue: 'developer',
})(Select)

export default class InitialValues extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Initial values</h1>
        <Form {...this.props}>
          <Input name="firstName" label="First name" initialValue="John" />
          <Input name="username" label="Username" required />

          <OccupattionSelect name="occupation">
            <option value="doctor">Doctor</option>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
          </OccupattionSelect>

          <Field.Group name="billingAddress">
            <Input id="billing-street" name="street" label="Street (billing)" />
            <Input name="houseNumber" label="Street" initialValue="4" />
          </Field.Group>

          <Field.Group name="deliveryAddress">
            <Input
              id="delivery-street"
              name="street"
              label="Street (delivery)"
            />
          </Field.Group>
        </Form>
      </React.Fragment>
    )
  }
}
