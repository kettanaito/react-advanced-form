import React from 'react'
import { Form, Field } from 'react-advanced-form'
import { Input, Select } from '@examples/fields'
import Button from '@examples/shared/Button'

export default class SetValues extends React.Component {
  handleButtonClick = (event) => {
    event.preventDefault()
    window.form.setValues({
      username: 'user',
      primaryInfo: {
        customerType: 'b2c',
      },
    })
  }

  render() {
    return (
      <React.Fragment>
        <h1>Set values</h1>

        <Form ref={(form) => (window.form = form)}>
          <Input
            name="username"
            label="User name"
            initialValue="admin"
            rule={({ value }) => value !== 'user'}
            required
          />

          <Field.Group name="primaryInfo">
            <Select
              name="customerType"
              label="Customer type"
              initialValue="b2b"
            >
              <option value="b2b">Business</option>
              <option value="b2c">Private</option>
            </Select>
          </Field.Group>
        </Form>

        <Button onClick={this.handleButtonClick}>Set values</Button>
      </React.Fragment>
    )
  }
}
