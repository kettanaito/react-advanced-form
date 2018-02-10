import React from 'react';
import { Form } from '@lib';
import { Input } from '@components';

export const fieldSelector = '[name="fieldOne"]';

const messages = {
  name: {
    fieldOne: {
      async: ({ extra }) => extra || 'Fallback message'
    }
  }
}

export default class FieldPropsAsyncRule extends React.Component {
  validateAsync = ({ value }) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 500);
    }).then(() => ({
      valid: (value !== 'foo'),
      extra: this.props.extra
    }));
  }

  render() {
    return (
      <Form messages={ messages }>
        <Input
          { ...this.props }
          name="fieldOne"
          asyncRule={ this.validateAsync } />
      </Form>
    )
  }
}
