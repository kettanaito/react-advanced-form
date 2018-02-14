import React from 'react';
import { Form, FormProvider, Field } from '../src';
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
  state = {
    type: 'text'
  }

  render() {
    const { type } = this.state;
    return (
        <Form rules={ rules } messages={ messages }>
          <h2>Reactive props</h2>

          <MyInput
            name="fieldOne"
            type={ type } />

          <MyInput
            name="fieldTwo"
            required={({ form }) => {
              form.subscribe(['fieldOne'], ({ value }) => {
                return !!nextProps.value;
              });
            }} />

          <button onClick={(event) => {
            event.preventDefault();
            this.setState(({ type }) => ({ type: (type === 'text') ? 'password' : 'text' }));
          }}>Toggle type</button>
        </Form>
    );
  }
}
