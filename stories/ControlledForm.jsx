import React from 'react';
import { Form, Condition } from '../src';
import { MyInput } from './custom-fields';

const validationMessages = {
  general: {
    missing: 'Missing',
    invalid: 'Wrong value'
  }
};

export default class ControlledForm extends React.Component {
  state = {
    userinfo: {}
  }

  handleSubmitStart = ({ fields, serialized, form }) => {
    console.groupCollapsed('handleSubmitStart');
    console.log('fields', fields);
    console.log('serialized', serialized);
    console.log('form', form);
    console.groupEnd();
  }

  render() {
    const { userinfo } = this.state;

    return (
      <Form
        messages={ validationMessages }
        onSubmitStart={ this.handleSubmitStart }>
        <div>
          <label>
            Username:
            <MyInput
              name="username"
              value={ userinfo.username }
              required />
          </label>
        </div>

        <MyInput
          name="sdfsdf"
          required />

        <div>
          <label>
            Password:
            <MyInput
              name="password"
              value={ userinfo.password }
              onChange={ ({ nextValue }) => {
                console.log('onchange', nextValue);

                this.setState(({ userinfo }) => ({
                  userinfo: {
                    ...userinfo,
                    password: nextValue
                  }
                }));
              }}
              required />
          </label>
        </div>

        <a href="#" onClick={ (event) => {
          event.preventDefault();
          this.setState({ userinfo: {
            username: 'foo',
            password: '123123'
          } });
        }}>Load source A</a>

        <a href="#" onClick={ (event) => {
          event.preventDefault();
          this.setState({ userinfo: {
            username: 'admin',
            password: null
          } });
        }}>Load source B</a>

        <button type="submit">Submit</button>
      </Form>
    );
  }
}