import React, { Component } from 'react';
import { FormProvider, Form, Field } from '../src';

const FieldComposite = () => (
  <div>
    <Field name="address" value="Baker" />
    <Field name="street" value="12/c" />
  </div>
);

export default class DefaultForm extends Component {
  handleFormAction = () => {
    console.log('action');

    return new Promise((resolve) => {
      setTimeout(() => resolve(), 2000);
    });
  }

  handleSubmitStart = (fields, formProps) => {
    console.warn('handleSubmitStart');
    console.log('fields', fields.toJS());
    console.log('formProps', formProps);
  }

  handleSubmitEnd = (fields, formProps) => {
    console.warn('handleSubmitEnd');
    console.log('fields', fields.toJS());
    console.log('formProps', formProps);
  }

  render() {
    return (
      <FormProvider
        rules={{
          name: {
            username: value => (value === 'ab123')
          }
        }}>
        <Form
          id="default-form-example"
          action={this.handleFormAction}
          onSubmitStart={this.handleSubmitStart}
          onSubmitEnd={this.handleSubmitEnd}>
          <div className="field-group">
            <Field
              name="username"
              rule={/^AB\d+$/}
              asyncRule={({ fieldProps }) => {
                return fetch('http://demo9102997.mockable.io/validate/productId', {
                  method: 'POST',
                  body: JSON.stringify({
                    userName: fieldProps.value
                  })
                });
              }} />
            <Field name="password" />
            <FieldComposite />
          </div>
          <button type="submit">Submit</button>
        </Form>
      </FormProvider>
    );
  }
}
