import React from 'react';
import { Form } from '@lib';
import { Input } from '@components';

export const fieldSelector = '[name="fieldOne"]';

const messages = {
  type: {
    text: {
      async: 'Fallback message'
    }
  },
  name: {
    fieldFour: {
      async: ({ extra }) => extra
    }
  }
}

export default class FieldPropsAsyncRule extends React.Component {
  validateAsync = ({ value, fieldProps }) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 500);
    }).then(() => ({
      valid: (value !== 'foo'),
      extra: (fieldProps.name === 'fieldFour') && 'extra string'
    }));
  }

  render() {
    return (
      <Form ref={ this.props.getRef } messages={ messages }>
        <Input
          id="fieldOne"
          name="fieldOne"
          label="Optional field with async rule"
          asyncRule={ this.validateAsync } />

        <Input
          id="fieldTwo"
          name="fieldTwo"
          label="Required field with async rule"
          asyncRule={ this.validateAsync }
          required />

        <Input
          id="fieldThree"
          name="fieldThree"
          rule={/^\d+$/}
          label="Required field with both sync and async rules"
          asyncRule={ this.validateAsync }
          required />

        <Input
          id="fieldFour"
          name="fieldFour"
          label="Required field with async rule and extra response props"
          asyncRule={ this.validateAsync }
          required />
      </Form>
    )
  }
}
