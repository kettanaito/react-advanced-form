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
      <Form>
        <Input
          name="fieldOne"
          initialValue="foo" />
        <Input
          name="fieldTwo"
          required={({ fields }) => {
            return !!fields.fieldOne.value;
          }} />
      </Form>
    );
  }
}
