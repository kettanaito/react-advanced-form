import React from 'react'
import { Form } from '@lib'
import { Input, Radio, Checkbox } from '@fields'
import Button from '@shared/Button'

export default class Submit extends React.Component {
  render() {
    return (
      <Form onSubmitStart={this.props.onSubmitStart}>
        <Input name="email" type="email" label="E-mail" required />
        <Input name="password" type="password" label="Password" required />
        <Checkbox
          name="termsAndConditions"
          labels="I agree to Terms and Conditions"
          required
        />

        <Button type="submit">Submit</Button>
      </Form>
    )
  }
}
