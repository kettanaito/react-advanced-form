import React from 'react';
import { Form, Field, Condition } from '../lib';

const validationRules = {};
const validationMessages = {};

export default class FullForm extends React.Component {
  handleSubmit = ({ serialized }) => {
    console.warn('Submit', serialized);
    return new Promise(resolve => resolve());
  }

  render() {
    return (
      <Form
        rules={ validationRules }
        messages={ validationMessages }
        action={ this.handleSubmit }>
        <Field.Group name="userInfo">
          <div>
            <label>
              User name:
              <Field.Input name="username" required />
            </label>
          </div>

          <div>
            <label>
              First name:
              <Field.Input name="firstName" />
            </label>
          </div>

          <div>
            <label>
              Last name:
              <Field.Input name="firstName" />
            </label>
          </div>

          <div>
            <p>Choose gender:</p>
            <label>
              Male
              <Field.Radio name="gender" value="male" checked />
            </label>
            <label>
              Female
              <Field.Radio name="gender" value="female" />
            </label>
          </div>
        </Field.Group>

        <div>
          Counry
          <Field.Select name="country">
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="UA">Ukraine</option>
          </Field.Select>
        </div>

        <Condition when={({ fields }) => fields.country && fields.country.value === 'UK'}>
          <Field.Group name="hobbies">
            <div>
              <p>Your hobbies</p>

              <label>
                Drawing
                <Field.Checkbox name="drawing" />
              </label>
              <label>
                Biking
                <Field.Checkbox name="biking" />
              </label>
              <label>
                Traveling
                <Field.Checkbox name="traveling" />
              </label>
            </div>
          </Field.Group>
        </Condition>

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
