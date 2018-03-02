import React from 'react';
import { Form } from '@lib';
import { Input } from '@fields';

export default class RxPropsBasic extends React.Component {
  render() {
    return (
      <Form>
        <Input name="fieldOne" initialValue="foo" />
        <Input
          name="fieldTwo"
          required={({ fields }) => {
            return (fields.fieldOne && !!fields.fieldOne.value);
          }} />
      </Form>
    );
  }
}
