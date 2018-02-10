import React from 'react';
import { Form } from '@lib';
import { Input } from '@components';

export const fieldSelector = '[name="fieldOne"]';

const rules = {
  type: {
    text: ({ value }) => (value.length > 3)
  },
  name: {
    fieldOne: ({ value }) => (value !== 'foo')
  }
};

export default class FormPropsRules extends React.Component {
  render() {
    return (
      <Form rules={ rules }>
        <Input { ...this.props } name="fieldOne" />
      </Form>
    );
  }
}
