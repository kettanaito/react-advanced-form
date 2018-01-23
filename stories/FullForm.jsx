import React from 'react';
import { Input, Select, Checkbox, Textarea } from 'react-advanced-form-addons';
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
        action={ this.handleSubmit }
        onFirstChange={ () => console.warn('Became dirty') }>
        <Field.Group name="userInfo">

          <div>
            <p>Choose gender:</p>
            <label>
              <Radio
                name="gender"
                value="male"
                onChange={({ nextValue }) => {
                  console.log('change', nextValue);
                  this.setState({ gender: nextValue });
                }} />
              Male
            </label>

            <label>
              <Radio
                name="gender"
                onChange={({ nextValue }) => this.setState({ gender: nextValue })}
                value="pooper"
                checked />
              Pooper
            </label>

            <label>
              <Radio
                name="gender"
                onChange={({ nextValue }) => this.setState({ gender: nextValue })}
                value="female" />
              Female
            </label>
          </div>
        </Field.Group>

        <Input
          name="foo"
          initialValue={ undefined }
          className="HOLLY SHIT!"
          required />
        <Input
          name="abc"
          initialValue={ undefined } />

        <div>
          Counry
          <Select name="country" initialValue={ (gender === 'male') ? 'UA' : 'UK' }>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="UA">Ukraine</option>
          </Select>
        </div>

        {/* <Condition when={({ fields }) => fields.country && fields.country.value === 'UK'}>
          <Field.Group name="hobbies">
            <div>
              <p>Your hobbies</p>

              <label>
                Drawing
                <Checkbox name="drawing" />
              </label>
              <label>
                Biking
                <Checkbox name="biking" />
              </label>
              <label>
                Traveling
                <Checkbox name="traveling" />
              </label>
            </div>
          </Field.Group>
        </Condition> */}

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
