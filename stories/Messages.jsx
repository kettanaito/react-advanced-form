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
  handleAsyncValidation = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          valid: false,
          fields: true
        });
      }, 1000);
    });

  state = {
    foo: true,
    type: 'text'
  }

  render() {
    const { foo, type } = this.state;

    return (
      <FormProvider rules={ providerRules } messages={ providerMessages }>
        <Form rules={ rules } messages={ messages }>
          <MyInput name="foo" />

          <MyInput
            name="fieldThree"
            asyncRule={ this.handleAsyncValidation } />

          <MyInput name="fieldOne" initialValue="foo" />
        <Form
          rules={ rules }
          messages={ messages }
          onSubmitStart={ console.warn }>

          {/* <MyInput name="abc" />
          <MyInput name="def" />
          <MyInput name="ghi" />
          <MyInput name="klm" />
          <MyInput name="opq" />
          <MyInput name="rst" />
          <MyInput name="vu" /> */}

          { foo && (
            <MyInput
              name="fieldOne"
              type={ type }
              initialValue="foo" />
          ) }

          <MyInput
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