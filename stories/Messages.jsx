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
  render() {
    return (
      <FormProvider rules={ providerRules } messages={ providerMessages }>
        <Form rules={ rules } messages={ messages }>
          <MyInput name="foo" />
        </Form>
      </FormProvider>
    );
  }
}