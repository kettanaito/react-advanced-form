import React from 'react'
import { Form } from 'react-advanced-form'
import { Input } from '@examples/fields'
import Button from '@examples/shared/Button'
import isEmail from 'validator/lib/isEmail'

export const submitTimeout = 1000

export default class Submit extends React.Component {
  submitEmail = ({ serialized }) => {
    const { email } = serialized

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'correct@email.example') {
          return resolve()
        }

        return reject()
      }, submitTimeout)
    })
  }

  render() {
    return (
      <React.Fragment>
        <h1>Form submit callbacks</h1>
        <Form {...this.props} ref={this.props.getRef} action={this.submitEmail}>
          <Input
            name="email"
            type="email"
            label="E-mail"
            rule={({ value }) => isEmail(value)}
            initialValue="correct@email.example"
            required
          />

          <Button type="submit">Submit</Button>
        </Form>
      </React.Fragment>
    )
  }
}
