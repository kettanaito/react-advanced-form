import React from 'react'
import { Form, Field } from 'react-advanced-form'
import { Input, Checkbox } from '@fields'
import Button from '@shared/Button'

export default class SplitGroups extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Split field groups</h1>

        <Form ref={(form) => (window.form = form)}>
          <div className="row">
            <div className="col-6">
              <Input
                name="email"
                type="email"
                label="E-mail"
                initialValue="john@maverick.com"
              />

              <Input
                name="password"
                type="password"
                label="Password"
                initialValue="super-secret"
              />

              <Field.Group name="primaryInfo">
                <Input
                  name="firstName"
                  label="First name"
                  initialValue="John"
                />
                <Input
                  name="lastName"
                  label="Last name"
                  initialValue="Maverick"
                />

                <Field.Group name="billingAddress">
                  <Input
                    name="street"
                    label="Street"
                    initialValue="Sunwell ave."
                  />
                </Field.Group>
              </Field.Group>
            </div>

            <div className="col-6">
              <Field.Group name="primaryInfo">
                <Checkbox
                  name="newsletter"
                  label="Subscribe to newsletter"
                  checked
                />

                <Field.Group name="billingAddress">
                  <Input
                    name="houseNumber"
                    label="House number"
                    initialValue="3"
                  />
                </Field.Group>
              </Field.Group>

              <Field.Group name="billingAddress">
                <Checkbox
                  name="noCollision"
                  label="Nesting is important"
                  checked
                />
              </Field.Group>
            </div>
          </div>

          <Button>Submit</Button>
        </Form>
      </React.Fragment>
    )
  }
}
