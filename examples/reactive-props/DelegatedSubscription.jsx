import React from 'react';
import { Form } from '@lib';
import { Input } from '@fields';
import Button from '@shared/Button';

export default class RxPropsDelegatedSubscription extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Delegated subscription</h1>

        <Form onSubmitStart={ this.props.onSubmitStart }>
          <Input
            name="firstName"
            label="Fisrt name"
            hint="Required when `lastName` has value"
            required={({ fields }) => {
              return !!fields.lastName.value;
            }} />
          <Input
            name="lastName"
            label="Last name"
            initialValue="foo" />

          <Button>Submit</Button>
        </Form>
      </React.Fragment>
    );
  }
}
