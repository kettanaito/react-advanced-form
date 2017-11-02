import React, { Component } from 'react';
import { Form, Field } from '../src';

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
      <Form
        id="default-form-example"
        action={this.handleFormAction}
        onSubmitStart={this.handleSubmitStart}
        onSubmitEnd={this.handleSubmitEnd}>
        <div className="field-group">
          <Field
            name="username"
            rule={/^AB\d+$/} />
          <Field
            name="password" />
        </div>
        <button type="submit">Submit</button>
      </Form>
    );
  }
}
