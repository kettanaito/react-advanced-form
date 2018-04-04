import React from 'react';
import { Form } from '@lib';
import Datepicker from './Datepicker';

export default class ReactDatepickerExample extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>react-datepicker</h1>

        <Form>
          <Datepicker
            name="birthDate" />
        </Form>
      </React.Fragment>
    );
  }
}