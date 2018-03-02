import React from 'react';
import { Form } from '@lib';
import { Input } from '@fields';

export default class FieldPropsRule extends React.Component {
  render() {
    return (
      <Form ref={ this.props.getRef }>
        <Input
          id="fieldOne"
          name="fieldOne"
          rule={/^\d+$/} />

        <Input
          id="fieldTwo"
          name="fieldTwo"
          rule={/^\d+$/}
          required />
      </Form>
    );
  }
}
