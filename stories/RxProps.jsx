import React from 'react';
import { FormProvider, Form, Field } from '../src';
import { Input, Checkbox } from '@fields';

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

  handleSubmitStart = ({ serialized }) => {
    console.warn(serialized);
  }

  render() {
    const { type } = this.state;

    return (
      <FormProvider withImmutable>
        <Form
          rules={ rules }
          messages={ messages }
          onSubmitStart={ this.handleSubmitStart }>
          <h2>Reactive props</h2>

          <Checkbox
            name="checkbox"
            label="Foo"
            required />

          <Input
            name="fieldOne"
            required={({ fields }) => {
              return !!fields.fieldTwo.value;
            }} />
          <Input
            name="fieldTwo"
            initialValue="foo" />

          {/* <Input
            name="fieldOne"
            initialValue="foo" />

          <Input
            name="rxField"
            required={({ fields }) => {
              return fields.fieldOne.value;
            }} />

          <Input
            name="fieldThree"
            type={ type }
            initialValue="something" /> */}

          <button onClick={(event) => {
            event.preventDefault();
            this.setState(({ type }) => ({
              type: (type === 'text') ? 'password' : 'text'
            }));
          }}>Toggle type</button>

          <button className="btn btn-primary">Submit</button>
        </Form>
      </FormProvider>
    );
  }
}
