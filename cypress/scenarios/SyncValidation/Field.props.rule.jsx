import React from 'react';
import { Form } from '@lib';
import { Input } from '@components';

export const fieldSelector = '[name="fieldOne"]';

export default class FieldPropsRule extends React.Component {
  render() {
    return (
      <Form>
        <Input
          { ...this.props }
          name="fieldOne"
          rule={/^\d+$/} />
      </Form>
    );
  }
}
