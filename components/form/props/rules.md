# rules

## Specification

Cutom validation rules schema applied to the form explicitly.

> Providing form-specific rules is designed to extend/rewrite the validation behavior of certian forms. For general usage it is recommended to provide the validation rules and messages through the [`FormProvider`](../../formprovider.md) component to be applied application-wide.

## Example

```jsx
import React from 'react';
import { Form } from 'react-advanced-form';

const formRules = {
  extend: true, // merge the current schema with the FormProvider's one
  type: {
    tel: ({ value }) => customPhoneValidationForThisFormOnly(value)
  }
};

export default class Example extends React.Component {
  render() {
    return (
      <Form rules={ formRules }>
        { /* Fields here */ }
      </Form>
    );
  }
}
```

## Useful resources

* [`FormProvider`](../../formprovider.md)
* [Validation rules](../../../validation/rules.md)

