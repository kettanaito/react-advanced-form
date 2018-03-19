import React from 'react';
import { applyEnhancers, Form } from '@lib';
import { Input } from '@fields';
import mask from '@lib/enhancers/mask';

const InputWithMask = applyEnhancers(mask)(Input);

console.log({ InputWithMask })

export default class MaskEnhancer extends React.Component {
  render() {
    return (
      <Form>
        <InputWithMask
          name="enhancedField"
          label="With mask"
          mask="## ## ##" />
      </Form>
    );
  }
}