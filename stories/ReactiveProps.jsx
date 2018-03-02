import React, { Component } from 'react';
import { FormProvider, Form } from '../src';
import { Input } from '@fields';

/* Form validation rules */
const formRules = {
  name: {
    username: ({ value }) => (value === 'ab123')
  }
};

export default class ControlledFields extends Component {
  handleFormAction = () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 2000);
    });
  }

  handleSubmitStart = ({ fields, serialized, formProps }) => {
    console.warn('handleSubmitStart');
    console.log('fields', fields.toJS());
    console.log('serialized', serialized);
    console.log('formProps', formProps);
  }

  renderForms = () => {
    const forms = [];

    for (let i = 0; i < 5; i++) {
      forms.push(
        <Form key={i}>
          <div style={{ display: 'flex' }}>
            <label>
              Product Id:
              <Input
                name="productId"
                required={({ fields }) => fields.producerNr && !fields.producerNr.value}
                asyncRule={({ value: productId }) => {
                  return new Promise(resolve => resolve())
                    .then(() => ({
                      valid: false
                    }))
                }} />
            </label>

            <label>
              Producer Nr:
              <Input
                name="producerNr"
                required={({ fields }) => fields.brand && !!fields.brand.value} />
            </label>

            <label>
              Brand:
              <Input
                name="brand"
                required={({ fields }) => fields.producerNr && !!fields.producerNr.value} />
            </label>
          </div>
        </Form>
      );
    }

    return forms;
  }

  render() {
    return (
      <FormProvider rules={ formRules }>
        { this.renderForms() }
        {/* <Form
          id="rfq-form-example"
          action={this.handleFormAction}
          onSubmitStart={this.handleSubmitStart}>
          <div className="field-group">

            <label>
              Product Id:
              <Input
                name="productId"
                required={({ fields }) => fields.producerNr && !fields.producerNr.value} />
            </label>

            <label>
              Producer Nr:
              <Input
                name="producerNr"
                required={({ fields }) => fields.brand && !!fields.brand.value} />
            </label>

            <label>
              Brand:
              <Input
                name="brand"
                required={({ fields }) => fields.producerNr && !!fields.producerNr.value} />
            </label>

          </div>
          <button type="submit">Submit</button>
        </Form> */}
      </FormProvider>
    );
  }
}
