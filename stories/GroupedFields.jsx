import React from 'react';
import { Form, Field } from '../src';
import { Input, Checkbox, Select, Radio, Textarea } from '@fields';

const rules = {
  name: {
    fieldOne: ({ fields }) => (fields.checkbox.checked),
    fieldTwo: {
      ruleOne: () => true,
      ruleTwo: ({ fields }) => fields.fieldOne.valid
    }
  }
};

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
};

export default class GroupedFields extends React.Component {
  handleSubmitStart = ({ serialized }) => {
    console.warn(serialized);
  }

  render() {
    return (
      <Form rules={ rules } messages={ messages } onSubmitStart={ this.handleSubmitStart }>
        <Input
          name="fieldOne"
          initialValue="foo"
          hint="I am valid only when agreed to Terms and Conditions" />

        <Checkbox
          name="checkbox"
          label="I agree to Terms and Conditions"
          checked />

        {/* <Field.Group name="groupName">
          <Input
            name="firstName"
            label="First name" />
          <Input
            name="lastName"
            label="Last name" />
        </Field.Group> */}

        {/* <Select
          name="select"
          label="Select"
          initialValue="B">
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </Select> */}

        <button className="btn btn-primary">Submit</button>
      </Form>
    );
  }
}
