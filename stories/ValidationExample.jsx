import React, { Component } from 'react';
import { FormProvider, Form, Condition, Field } from '../src';
import { Input } from '@fields';

/* Form validation rules */
const formRules = {
  type: {
    email: ({ value }) => value,
    password: {
      capitalLetter: ({ value }) => /[A-Z]/.test(value),
      oneNumber: ({ value }) => /[0-9]/.test(value),
      minLength: ({ value }) => (value.length > 6)
    }
  },
  name: {
    firstName: ({ value }) => (value !== 'foo'),
    confirmPassword: {
      match: ({ value, fields }) => {
        return (value === fields.userPassword.value);
      }
    }
  }
};

const formMessages = {
  general: {
    missing: 'Please provide the required field',
    invalid: 'Provided value is invalid'
  },
  type: {
    password: {
      rules: {
        capitalLetter: 'Password must include at least one capital letter',
        oneNumber: 'Please include at least one number'
      }
    }
  },
  name: {
    confirmPassword: {
      rules: {
        match: 'Provided passwords do not match'
      }
    },
    quantity: {
      missing: 'Please provide the quantity',
      invalid: 'The quantity is invalid',
      async: ({ errorMessage }) => errorMessage
    }
  }
};

export default class ValidationExample extends Component {
  serialize = () => {
    this.form.serialize();
  }

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
          ref={ form => this.form = form }
          id="default-form-example"
          ref={ form => this.form = form }
          action={ this.handleFormAction }
          onInvalid={ console.log }
          onSubmitStart={ this.handleSubmitStart }>

          <Input
            name="quantity"
            placeholder="Quantity"
            rule={({ value }) => (value !== 'foo')}
            asyncRule={({ value, fieldProps }) => {
              console.log(fieldProps);
              return new Promise((resolve) => {
                setTimeout(resolve, 3000);
              }).then(() => ({
                valid: (value !== '5'),
                errorMessage: 'Error message from back-end'
              }));
            }}
            required />

          First name:
          <Input
            name="firstName"
            onChange={({ fieldProps }) => {
              console.log('valid:', fieldProps.valid);
            }}
            required />

          NUMBERS:
          <Input name="lastName" rule={/^\d+$/} />

          <button onClick={ this.serialize }>Serialize</button>

          <hr />

          {/* <Input
            name="userEmail"
            type="email"
            label="E-mail"
            required />

          <Input
            name="userPassword"
            type="password"
            label="Password"
            required />

          <Input
            name="confirmPassword"
            type="password"
            label="Confirm password"
            required /> */}

          <button type="submit">Submit</button>
        </Form>
      </FormProvider>
    );
  }
}
