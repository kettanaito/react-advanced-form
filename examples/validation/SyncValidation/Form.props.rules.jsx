import React from 'react';
import { Form } from '@lib';
import { Input } from '@fields';

export const fieldSelector = '[name="fieldOne"]';

const rules = {
  type: {
    text: ({ value }) => (value.length > 3)
  },
  name: {
    fieldOne: ({ value, fieldProps }) => {
      const { ref: { props } } = fieldProps;
      return (value !== 'foo');
    },
    fieldTwo: ({ value, getFieldProp }) => {
      return (value === getFieldProp(['fieldOne', 'value']));
    }
  }
};

export default class FormPropsRules extends React.Component {
  render() {
    return (
      <Form rules={ rules }>
        <Input
          { ...this.props }
          name="fieldOne"
          label="Field one"
          hint="Must be more than 3 characters and not equal to `foo`" />
        <Input
          name="fieldTwo"
          label="Field two"
          hint="Valid when equals to `fieldOne` value" />
      </Form>
    );
  }
}
