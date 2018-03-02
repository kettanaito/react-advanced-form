# Creating form

## Introduction
After our [composite fields](./creating-fields) are prepared, we can construct any forms we need.

Simply place a `Form` component and pass the necessary fields as its children. No tons of configurations, no obscure field declarations. The goal is to have forms with a clean layout and expected behavior.

At this point we are going to focus on the layout only.

## Example
```jsx
import React from 'react';
import { Form } from 'react-advanced-form';

/* Custom field components */
import { Input, Checkbox } from '../components';

export default class ExampleForm extends React.Component {
  render() {
    return (
      <Form>
        <Input
          name="userEmail"
          required />
        <Input
          name="userPassword"
          type="password"
          required />
        <Checkbox
          name="..."
          value="apples" />
      </Form>
    )
  }
}
```
