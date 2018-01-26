import React, { Component } from 'react';
import { FormProvider, Form, Condition, Field } from '../src';
import { MyInput, MySelect, MyCheckbox, MyTextarea } from './custom-fields';

/* Form validation rules */
const formRules = {
  type: {
    text: ({ value }) => value !== 's'
  },
  name: {
    quantity: {
      forbidLetters: ({ value }) => /^\d+$/.test(value),
      maxValue: ({ value }) => (value <= 10)
    }
  }
};

const formMessages = {
  general: {
    missing: 'General missing message',
    invalid: 'General invalid message'
  },
  type: {
    text: {
      invalid: 'Type "text" invalid message'
    }
  },
  name: {
    quantity: {
      missing: 'Name-specific missing message',
      invalid: 'Name-specific invalid message',
      rules: {
        forbidLetters: ({ value }) => `Does "${value}" look like a number to you?`
      }
    }
  }
};

export default class ValidationExample extends Component {
  handleFormAction = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject({ errorMessage: 'foo' }), 2000);
    });
  }

  handleFormInvalid = ({ fields, invalidFields, form}) => {
    console.groupCollapsed('onInvalid');
    console.log('fields', fields);
    console.log('invalidFields', invalidFields);
    console.log('form', form);
    console.groupEnd();
  }

  handleSubmitStart = ({ fields, serialized, form }) => {
    console.groupCollapsed('handleSubmitStart');
    console.log('fields', fields);
    console.log('serialized', serialized);
    console.log('form', form);
    console.groupEnd();
  }

  render() {
    return (
      <FormProvider
        rules={ formRules }
        messages={ formMessages }>
        <Form
          id="default-form-example"
          ref={ form => this.form = form }
          action={ this.handleFormAction }
          onSubmitStart={ this.handleSubmitStart }>

          <MyInput
            name="quantity"
            initialValue="s"
            placeholder="Quantity"
            required />

          <button type="submit">Submit</button>
        </Form>
      </FormProvider>
    );
  }
}
