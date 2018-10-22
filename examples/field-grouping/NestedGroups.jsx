import React from 'react'
import { Form, Field } from 'react-advanced-form'
import { Input } from '@fields'
import Button from '@shared/Button'

export default class NestedGroups extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Nested field groups</h1>

        <Form ref={(form) => (window.form = form)}>
          <Input
            name="fieldOne"
            hint={<code>fieldOne</code>}
            initialValue="foo"
          />

          <Field.Group name="groupName">
            <Input
              name="fieldOne"
              hint={<code>groupName.fieldOne</code>}
              initialValue="bar"
            />
            <Input hint={<code>groupName.fieldTwo</code>} name="fieldTwo" />

            <Field.Group name="nestedGroup">
              <Input
                name="fieldOne"
                hint={<code>groupName.nestedGroup.fieldOne</code>}
                initialValue="poo"
              />
            </Field.Group>
          </Field.Group>

          <Button>Submit</Button>
        </Form>
      </React.Fragment>
    )
  }
}
