import React from 'react';
import { Form } from '@lib';
import { Input } from '@components';

export default class RxPropsDelegated extends React.Component {
  render() {
    return (
      <Form>
        <Input
          name="fieldOne"
          required={({ fields }) => {
            return (fields.fieldTwo && !!fields.fieldTwo.value);
          }} />
        <Input name="fieldTwo" initialValue="foo" />
      </Form>
    );
  }
}
