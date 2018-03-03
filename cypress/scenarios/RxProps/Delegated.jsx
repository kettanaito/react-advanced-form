import React from 'react';
import { Form } from '@lib';
import { Input } from '@fields';

export default class RxPropsDelegated extends React.Component {
  render() {
    return (
      <Form>
        <Input
          name="fieldOne"
          required={({ subscribe }) => {
            return !!subscribe('fieldTwo', 'value');
          }} />
        <Input
          name="fieldTwo"
          initialValue="foo" />
      </Form>
    );
  }
}
