import React from 'react'
import { Form } from '@lib'
import { Input } from '@fields'

export default class FieldReactiveRule extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Reactive field rule</h1>
        <Form>
          <Input name="fieldOne" label="Field one" />
          <Input
            name="fieldTwo"
            label="Field two"
            hint="Valid when equals to `fieldOne` value"
            rule={({ get, value }) => {
              return value === get(['fieldOne', 'value'])
            }}
          />
        </Form>
      </React.Fragment>
    )
  }
}
