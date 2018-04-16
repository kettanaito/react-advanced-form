import React from 'react';
import { Form } from '@lib';
import { Input } from '@fields';
import Button from '@shared/Button';

export default class RxPropsSingleTarget extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Single target</h1>

        <Form onSubmitStart={ this.props.onSubmitStart }>
          <Input
            name="firstName"
            label="First name"
            hint="Required when `lastName` has value"
            required={({ get }) => {
              return !!get(['lastName', 'value']);
            }} />
          <Input
            name="lastName"
            label="Last name" />
          <Input
            name="fieldThree"
            label="Some field three"
            hint="Required when `lastName` has value"
            required={({ get }) => {
              return !!get(['lastName', 'value'])
            }} />
          <Button>Submit</Button>
        </Form>
      </React.Fragment>
    );
  }
}
