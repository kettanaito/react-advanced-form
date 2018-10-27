import React from 'react'
import { Form } from 'react-advanced-form'
import { Input } from '@examples/fields'
import Button from '@examples/shared/Button'

export default class RxPropsInterdependent extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Interdependent fields</h1>

        <Form onSubmitStart={this.props.onSubmitStart}>
          <Input
            name="firstName"
            label="First name"
            hint="Required when `lastName` has value"
            required={({ get }) => {
              return !!get(['lastName', 'value'])
            }}
          />
          <Input
            name="lastName"
            label="Last name"
            hint="Required when `firstName` has value"
            required={({ get }) => {
              return !!get(['firstName', 'value'])
            }}
          />

          <Button>Submit</Button>
        </Form>
      </React.Fragment>
    )
  }
}
