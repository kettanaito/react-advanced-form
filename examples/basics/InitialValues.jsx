import React from 'react'
import { fieldPresets, createField, Form, Field } from 'react-advanced-form'
import { Input } from '@examples/fields'
import { Select } from '@examples/fields/Select'
import { Checkbox } from '@examples/fields/Checkbox'
import Button from '@examples/shared/Button'

export const initialValues = {
  firstName: 'Kate',
  username: 'admin',
  billingAddress: {
    street: 'Baker st.',
  },
  deliveryAddress: {
    street: 'Sunwell ave.',
    equalToBilling: true
  },
}

/**
 * Create a field class where "initialValue" is set
 * for all instances of that class.
 */
const Occupation = createField({
  ...fieldPresets.select,
  initialValue: 'developer',
})(Select)

export default class InitialValues extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Initial values</h1>
        <Form initialValues={initialValues}>
          <Input name="firstName" label="First name" initialValue="John" />
          <Input name="username" label="Username" required />

          <Occupation name="occupation">
            <option value="doctor">Doctor</option>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
          </Occupation>

          <Field.Group name="billingAddress">
            <Input id="billing-street" name="street" label="Street (billing)" />
            <Input name="houseNumber" label="Street" initialValue="4" />
          </Field.Group>

          <Field.Group name="deliveryAddress">
            <Checkbox
              id="equalToBilling"
              name="equalToBilling"
              label="Is equal to billing address"
            />
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
