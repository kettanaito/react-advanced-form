# Creating a form

## Introduction
React Advanced Form is field-centric. That means that it treats each form as a composite component containing various [field components](./creating-fields).

Simply place a `Form` component and pass the necessary fields as its children. Statically or dynamically, that doesn't matter.

## Example
```jsx
import React from 'react';
import { Form } from 'react-advanced-form';

/* Composite field components */
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
          name="termsAndConditions" />
      </Form>
    )
  }
}
```

> This is but a minimal example. More complex topics, like field validation or submit handling will be covered in the next steps of this guide.
