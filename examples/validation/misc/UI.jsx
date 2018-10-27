import React from 'react'
import { Form } from 'react-advanced-form'
import { Input } from '@examples/fields'

export default class UI extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h3>UI behavior</h3>
        <Form>
          <Input
            name="fieldOne"
            label="Field one"
            hint="Only numbers allowed"
            rule={/^\d+$/}
          />
          <Input
            name="fieldTwo"
            label="Field two"
            hint="Must be longer than 3 characters"
            rule={({ value }) => value.length > 3}
          />
        </Form>
      </React.Fragment>
    )
  }
}
