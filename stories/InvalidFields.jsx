import React from 'react';
import { Input } from 'react-advanced-form-addons';
import { Form, Field, Condition } from '../lib';
import { TValidationMessages } from '../src/FormProvider';

const validationMessages = {
  general: {
    missing: 'Missing',
    invalid: 'Wrong value'
  }
};

export default class InvalidFields extends React.Component {
  handleInvalidForm = ({ invalidFields }) => {
    console.warn('Invalid form', invalidFields);
  }

  render() {
    return (
      <Form
        messages={ validationMessages }
        onInvalid={ this.handleInvalidForm }>
        <div>
          <label>
            One:
            <Input name="one" required />
          </label>
        </div>

        <Condition when={({ fields }) => fields.one && fields.one.valid}>
          <div>
            <label>
              Two:
              <Input name="two" required />
            </label>
          </div>

          <div>
            <label>
              Three:
              <Input name="three" required />
            </label>
          </div>
        </Condition>

        <div>
          <label>
            Four:
            <Input name="four" required />
          </label>
        </div>

        <button type="submit">Submit</button>
      </Form>
    );
  }
}