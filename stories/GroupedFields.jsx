import React from 'react';
import { Form, Field } from '../src';
import { Input, Checkbox, Select, Radio, Textarea } from '@fields';

const messages = {
  general: {
    missing: 'Please provide the required field',
    invalid: 'The value provided is invalid'
  },
  type: {
    checkbox: {
      missing: 'Please agree to Terms and Conditions'
    }
  }
}

export default class GroupedFields extends React.Component {
  handleSubmitStart = ({ serialized }) => {
    console.warn(serialized);
  }

  render() {
    return (
      <Form messages={ messages } onSubmitStart={ this.handleSubmitStart }>
        <Input
          name="fieldOne"
          initialValue="foo"
          hint="Helpful hint message" />

        <Field.Group name="groupName">
          <Input
            name="firstName"
            label="First name"
            required={({ subscribe }) => {
              return !!subscribe('groupName', 'lastName', 'value');
            }} />
          <Input
            name="lastName"
            label="Last name"
            required={({ subscribe }) => {
              return !!subscribe('groupName', 'firstName', 'value');
            }} />
        </Field.Group>

        <Select
          name="select"
          label="Select"
          initialValue="B">
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </Select>

        <Checkbox
          name="checkbox"
          label="I agree to Terms and Conditions"
          required />

        <Radio
          name="radio"
          label="Choice A"
          value="A" />
        <Radio
          name="radio"
          label="Choice B"
          value="B"
          checked />

        <Textarea
          name="textarea"
          label="Description" />

        <button className="btn btn-primary">Submit</button>
      </Form>
    );
  }
}
