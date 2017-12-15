import React from 'react';
import { Form, Field, Condition } from '../src';

const validationRules = {};
const validationMessages = {};

export default class FullForm extends React.Component {
  constructor() {
    super();

    this.state = {
      gender: 'pooper'
    };
  }

  handleSubmit = ({ serialized }) => {
    console.warn('Submit', serialized);
    return new Promise(resolve => resolve());
  }

  render() {
    const { gender } = this.state;

    return (
      <Form
        rules={ validationRules }
        messages={ validationMessages }
        action={ this.handleSubmit }>
        <Field.Group name="userInfo">
          {/* <div>
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
          </div> */}

          <div>
            <p>Choose gender:</p>
            <label>
              <Field.Radio
                name="gender"
                value="male"
                onChange={({ nextValue }) => {
                  console.log('change', nextValue);
                  this.setState({ gender: nextValue });
                }} />
              Male
            </label>

            <label>
              <Field.Radio
                name="gender"
                onChange={({ nextValue }) => this.setState({ gender: nextValue })}
                value="pooper"
                checked />
              Pooper
            </label>

            <label>
              <Field.Radio
                name="gender"
                onChange={({ nextValue }) => this.setState({ gender: nextValue })}
                value="female" />
              Female
            </label>
          </div>
        </Field.Group>

        <div>
          Counry
          <Field.Select name="country" initialValue={ (gender === 'male') ? 'UA' : 'UK' }>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="UA">Ukraine</option>
          </Field.Select>
        </div>

        {/* <Condition when={({ fields }) => fields.country && fields.country.value === 'UK'}>
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
        </Condition> */}

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
