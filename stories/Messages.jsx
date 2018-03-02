import React from 'react';
import { Form, FormProvider, Field } from '../src';
import { Input } from '@fields';

const providerRules = {
  type: {
    text: ({ value }) => (value !== '')
  }
};

const providerMessages = {
  general: {
    invalid: 'General invalid'
  }
};

const rules = {
  name: {
    foo: ({ value }) => (value > 10)
  }
};

const messages = {
  general: {
    missing: 'Please provide the required field'
  },
  name: {
    foo: {
      invalid: 'Foo!'
    }
  }
}

export default class Messages extends React.Component {
  render() {
    return (
      <FormProvider rules={ providerRules } messages={ providerMessages }>
        <Form rules={ rules } messages={ messages }>
          <Input name="foo" />

          <Input
            name="fieldThree"
            asyncRule={ this.handleAsyncValidation } />

          <Input name="fieldOne" initialValue="foo" />

          <Input
            name="fieldTwo"
            required={({ fields }) => {
              return fields.fieldOne && fields.fieldOne.subscribe('value', ({ value }) => !!value);
            } } />

          <button onClick={(event) => {
            event.preventDefault();
            this.setState(({ foo }) => ({ foo: !foo }));
          }}>Toggle render</button>

          <button onClick={(event) => {
            event.preventDefault();
            this.setState(({ type }) => ({
              type: (type === 'text') ? 'password' : 'text'
            }))
          }}>Toggle type</button>

          <button>Submit</button>

        </Form>
      </FormProvider>
    );
  }
}
