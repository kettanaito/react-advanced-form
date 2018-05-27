import React from 'react'
import { Form } from '@lib'
import { Input } from '@fields'

export default class FieldReactiveRule extends React.Component {
  render() {
    return (
      <Form>
        <Input name="fieldOne" label="Field one" />
        <Input
          name="fieldTwo"
          rule={({ value, get }) => {
            return value === get(['fieldOne', 'value'])
          }}
        />
      </Form>
    )
  }
}
