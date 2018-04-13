import React from 'react';
import { applyEnhancers, Form } from '@lib';
import { Input } from '@fields';
import Button from '@shared/Button';
import mask from '@lib/enhancers/mask';

const InputWithMask = applyEnhancers(mask)(Input);

export default class MaskEnhancer extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Mask</h1>
        <Form onSubmitStart={ this.props.onSubmitStart }>
          <InputWithMask
            name="creditCardNumber"
            label="Enter a credit card number"
            mask="#### #### #### ####"
            useStrictMask />

          <InputWithMask
            name="phoneNumber"
            label="Enter a phone number"
            mask="+(###) ### ## ##"
            useStrictMask />

          <Button>Submit</Button>
        </Form>
      </React.Fragment>
    );
  }
}
