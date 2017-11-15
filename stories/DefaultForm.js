import React, { Component } from 'react';
import { FormProvider, Form, Field } from '../src';
import MyInput from './templates/MyInput';

/* Form UI templates */
const formTemplates = {
  Input: MyInput
};

/* Form validation rules */
const formRules = {
  name: {
    username: value => (value === 'ab123')
  }
};

/* Composite field example */
const FieldsComposition = () => (
  <div style={{ display: 'flex' }}>
    <Field name="address" value="Baker" />
    <Field name="street" value="12/c" />
  </div>
);

export default class DefaultForm extends Component {
  handleFormAction = () => {
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
      <FormProvider templates={ formTemplates } rules={ formRules }>
        <Form
          id="default-form-example"
          action={this.handleFormAction}
          onSubmitStart={this.handleSubmitStart}
          onSubmitEnd={this.handleSubmitEnd}>
          <div className="field-group">
            <label>
              Non-required field (rule + async rule)
              <Field
                name="username"
                placeholder="correct: AB123"
                rule={/^AB\d{3}$/}
                asyncRule={({ fieldProps }) => {
                  return fetch('http://demo9102997.mockable.io/validate/productId', {
                    method: 'POST',
                    body: JSON.stringify({
                      userName: fieldProps.value
                    })
                  });
                }} />
            </label>
            <label>
              Required field (no add. validation)
              <Field name="password" required />
            </label>
            <label>
              Composite field:
              <FieldsComposition />
            </label>
          </div>
          <button type="submit">Submit</button>
        </Form>
      </FormProvider>
    );
  }
}
