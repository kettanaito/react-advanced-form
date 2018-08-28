import React from 'react'
import { fieldPresets, createField, Form } from '@lib'
import { Input } from '@fields'
import { Select } from '@examples/fields/Select'
import Button from '@shared/Button'

const OccupattionSelect = createField({
  ...fieldPresets.select,
  initialValue: 'developer',
})(Select)

export default class InitialValues extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Initial values</h1>
        <Form {...this.props}>
          <Input name="firstName" label="First name" initialValue="John" />
          <Input name="username" label="Username" required />

          <OccupattionSelect name="occupation">
            <option value="doctor">Doctor</option>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
          </OccupattionSelect>
        </Form>
      </React.Fragment>
    )
  }
}
