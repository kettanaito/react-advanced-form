import React from 'react';
import { Form } from '@lib';
import { Input } from '@fields';

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
};

export default class FieldPropsAsyncRule extends React.Component {
  validateAsync = ({ value, fieldProps }) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 500);
    }).then(() => ({
      valid: (fieldProps.name === 'fieldThree') ? (value !== '123') : (value !== 'foo'),
      extra: (fieldProps.name === 'fieldFour') && 'Data from async response'
    }));
  }

  render() {
    return (
      <Form ref={ this.props.getRef } messages={ messages }>
        <Input
          id="fieldOne"
          name="fieldOne"
          label="Field one"
          hint="Must not equal to `foo`"
          asyncRule={ this.validateAsync } />

        <Input
          id="fieldTwo"
          name="fieldTwo"
          label="Field two"
          hint="Must be provided and not equal to `foo`"
          asyncRule={ this.validateAsync }
          required />

        <Input
          id="fieldThree"
          name="fieldThree"
          rule={/^\d+$/}
          label="Field three"
          hint="Must be provided, contain numbers only and not equal to `123`"
          asyncRule={ this.validateAsync }
          required />

        <Input
          id="fieldFour"
          name="fieldFour"
          label="Required field with async rule and extra response props"
          hint="Propagates response data to the validation message on fail"
          asyncRule={ this.validateAsync }
          required />
      </Form>
    );
  }
}
