import React from 'react';
import { Form } from '@lib';
import { Input } from '@fields';

export default class RxPropsOneTarget extends React.Component {
  render() {
    return (
      <Form>
        <Input
          name="fieldOne"
          required={({ fields }) => {
            return (fields.fieldTwo && !!fields.fieldTwo.value);
          }} />
        <Input name="fieldTwo" />
        <Input
          name="fieldThree"
          required={({ fields }) => {
            return fields.fieldTwo && !!fields.fieldTwo.value;
          }} />
      </Form>
    );
  }
}
