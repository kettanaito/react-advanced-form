import React from 'react';
import { Form } from '@lib';
import { Input } from '@fields';
import Button from '@shared/Button';

export default class RxPropsDynamicRequired extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Dynamic required</h1>

        <Form onSubmitStart={ this.props.onSubmitStart }>
          <Input
            name="firstName"
            label="First name"
            initialValue="John" />
          <Input
            name="lastName"
            label="Last name"
            hint="Required when `firstName` has value"
            required={({ get }) => {
              return !!get(['firstName', 'value']);
            }} />

          <Button>Submit</Button>
        </Form>
      </React.Fragment>
    );
  }
}
