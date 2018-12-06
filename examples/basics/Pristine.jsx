import React from 'react'
import { Form } from 'react-advanced-form'
import { Input } from '@examples/fields'
import Button from '@examples/shared/Button'

export default class Pristine extends React.Component {
  resetForm = () => {
    window.form.reset()
  }

  render() {
    return (
      <React.Fragment>
        <h1>Pristine</h1>
        <Form ref={(form) => (window.form = form)}>
          <Input name="username" label="User name" />
          <Input name="firstName" label="First name" initialValue="John" />

          <Button id="reset" type="reset" onClick={this.resetForm}>
            Reset
          </Button>
        </Form>
      </React.Fragment>
    )
  }
}
