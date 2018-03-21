import React from 'react';
import { Form, Field } from '@lib';
import { Input } from '@fields';

export default class NestedGroups extends React.Component {
  render() {
    return (
      <Form ref={ this.props.getRef }>
        <Input
          name="fieldOne"
          hint={<code>fieldOne</code>}
          initialValue="foo" />

        <Field.Group name="groupName">
          <Input
            name="fieldOne"
            hint={<code>groupName.fieldOne</code>}
            initialValue="bar" />
          <Input
            hint={<code>groupName.fieldTwo</code>}
            name="fieldTwo" />

          <Field.Group name="nestedGroup">
            <Input
              name="fieldOne"
              hint={<code>groupName.nestedGroup.fieldOne</code>}
              initialValue="poo" />
          </Field.Group>
        </Field.Group>
      </Form>
    );
  }
}
