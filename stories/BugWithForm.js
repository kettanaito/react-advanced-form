import React from 'react';
import { Form, Field, Condition } from '../lib';
import MyInput from './templates/MyInput';

const validationMessages = {
  general: {
    missing: 'Missing',
    invalid: 'Wrong value'
  }
};

export default class BugWithForm extends React.Component {
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
            <MyInput name="one" required />
          </label>
        </div>

        <Condition when={({ fields }) => fields.one && fields.one.valid}>
          <div>
            <label>
              Two:
              <MyInput name="two" required />
            </label>
          </div>

          <div>
            <label>
              Three:
              <MyInput name="three" required />
            </label>
          </div>
        </Condition>

        <div>
          <label>
            Four:
            <MyInput name="four" required />
          </label>
        </div>

        <button type="submit">Submit</button>
      </Form>
    );
  }
}