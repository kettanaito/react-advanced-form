import React from 'react';
import { Form, FormProvider } from '../src';
import { MyInput } from './custom-fields';

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
  name: {
    foo: {
      invalid: 'Foo!'
    }
  }
}

export default class Messages extends React.Component {
  handleAsyncValidation = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          valid: false,
          fields: true
        });
      }, 1000);
    });
  }

  render() {
    return (
      <FormProvider rules={ providerRules } messages={ providerMessages }>
        <Form rules={ rules } messages={ messages }>
          <MyInput name="foo" />

          <MyInput
            name="fieldTwo"
            asyncRule={ this.handleAsyncValidation } />
        </Form>
      </FormProvider>
    );
  }
}