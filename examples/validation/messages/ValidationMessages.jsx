import React from 'react'
import { Form } from 'react-advanced-form'
import { Input } from '@examples/fields'
import isEmail from 'validator/lib/isEmail'

const rules = {
  type: {
    email: ({ value }) => isEmail(value),
  },
  name: {
    nameOne: ({ value }) => value !== 'bar',
    nameTwo: ({ value }) => value !== 'bar',
  },
}

export const messages = {
  general: {
    missing: 'Please provide the required field',
    invalid: 'The field value is wrong',
  },
  type: {
    email: {
      missing: 'Please provide an email',
      invalid: 'The providede email is invalid',
    },
  },
  name: {
    nameOne: {
      invalid: 'The name one is invalid',
    },
    nameTwo: {
      missing: 'Please provide name two',
      invalid: 'The name two is invalid',
    },
  },
}

export default class ValidationMessages extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Validation messages</h1>

        <Form rules={rules} messages={messages}>
          <h4>General</h4>
          <div className="row">
            {/* General */}
            <div className="col">
              <Input
                name="generalOne"
                label="Field one"
                hint="Has no message"
              />
            </div>
            <div className="col">
              <Input
                name="generalTwo"
                label="Field two"
                hint="General missing"
                required
              />
            </div>
          </div>

          {/* Type-specific */}
          <h4>Type</h4>
          <div className="row">
            <div className="col">
              <Input type="email" name="typeOne" label="Type one" />
            </div>
            <div className="col">
              <Input type="email" name="typeTwo" label="Type two" required />
            </div>
          </div>

          {/* Name-specific */}
          <h4>Name</h4>
          <div className="row">
            <div className="col">
              <Input name="nameOne" label="Name one" />
            </div>
            <div className="col">
              <Input name="nameTwo" label="Name two" required />
            </div>
          </div>
        </Form>
      </React.Fragment>
    )
  }
}
