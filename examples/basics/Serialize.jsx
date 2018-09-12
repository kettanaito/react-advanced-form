import React from 'react'
import { Form, Field } from '@lib'
import { Input } from '@fields'
import Button from '@shared/Button'

export const formatAddress = (address) => {
  const [_, street, houseNumber] = address.match(/(.+)(\d.)/)
  return { street, houseNumber }
}

export default class Serialize extends React.Component {
  mapSerialized = ({ serialized }) => {
    const { password, billingAddress } = serialized

    return {
      ...serialized,
      password: btoa(password),
      billingAddress: this.mapBillingAddress(billingAddress),
    }
  }

  mapBillingAddress = (fields) => {
    const { street, houseNumber } = formatAddress(fields.address)

    return {
      street,
      houseNumber,
    }
  }

  render() {
    return (
      <React.Fragment>
        <h1>Serialization</h1>
        <Form ref={this.props.getRef} onSerialize={this.mapSerialized}>
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
