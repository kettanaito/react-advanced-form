import React from 'react'
import { Form } from '@lib'
import { Input } from '@fields'

export default class FieldPropsRule extends React.Component {
  render() {
    return (
      <Form>
        <Input
          id="fieldOne"
          name="fieldOne"
          label="Field one"
          hint="Only numbers allowed"
          rule={/^\d+$/}
        />

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
