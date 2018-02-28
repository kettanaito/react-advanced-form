import React from 'react';
import { Form, Field } from '../src';
import { MyInput } from './custom-fields';

export default class GroupedFields extends React.Component {
  handleSubmitStart = ({ serialized }) => {
    console.warn(serialized);
  }

  render() {
    return (
      <Form onSubmitStart={ this.handleSubmitStart }>
        <MyInput
          name="fieldOne"
          initialValue="foo" />

        <Field.Group name="groupName">
          <MyInput
            name="firstName"
            required={({ subscribe }) => {
              return !!subscribe('groupName', 'lastName').value;
            }} />
          <MyInput
            name="lastName"
            required={({ subscribe }) => {
              return !!subscribe('groupName', 'firstName').value;
            }} />
        </Field.Group>

        {/* <MyInput
          name="fieldThree"
          initialValue="something" /> */}

        <button>Submit</button>
      </Form>
    );
  }
}
