import React from 'react'
import { Form, Field } from 'react-advanced-form'
import { Input } from '@examples/fields'
import Button from '@examples/shared/Button'

export const formatAddress = (address) => {
  const [_, street, houseNumber] = address.match(/(.+)(\d.)/)
  return { street, houseNumber }
}

export default class Serialize extends React.Component {
  mapBillingAddress = (fields) => {
    const { street, houseNumber } = formatAddress(fields.address)

    return {
      street,
      houseNumber,
    }
  }

  mapSerialized = ({ serialized }) => {
    const { password, billingAddress } = serialized

    return {
      ...serialized,
      password: btoa(password),
      billingAddress: this.mapBillingAddress(billingAddress),
    }
  }

  render() {
    return (
      <React.Fragment>
        <h1>Serialization</h1>
        <Form
          ref={(form) => (window.form = form)}
          onSerialize={this.mapSerialized}
        >
          <Input
            name="email"
            type="email"
            label="E-mail"
            initialValue="foo@bar.com"
            required
          />
          <Input
            name="password"
            type="password"
            label="Password"
            initialValue="admin"
            required
          />

          <Field.Group name="billingAddress">
            <Input name="address" initialValue="Baker st. 12" />
          </Field.Group>

          <Button type="submit">Submit</Button>
        </Form>
      </React.Fragment>
    )
  }
}
