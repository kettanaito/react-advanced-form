# Validation rules

## Introduction
This is an overview how to declare your own validation rules to be understood by React Advanced Form. This API was developed for over a year while working on a huge e-commerce solution website. We knew we needed something easy to write and maintain, while being flexible and quite powerful to provide for our needs.

## Specification
### Rule groups
* **name-specific rules**. Those have the highest priority. Once provided, any field with the matching name will be validated against the specified rule. Name-specific rules always **override** type-specific rules.
* **type-specific rule**. Those have the average priority. Once a field doesn't have a corresponding name-specific rule, it gets validated against the type-specific rule matching its type.

### Rule declaration
```ts
{
  [ruleSelector: string]: ({ value, fieldProps, fields, formProps }) => boolean
}
```

## Example
### Declaration
It's a best practice to declare and manage your validation rules at one place. Below you can see an example of a simple rules declaration having both `type` and `name` specific rules.

```js
// src/app/validation-rules.js
export default {
  type: {
    text: ({ value }) => !!value,
    email: ({ value }) => customValidator(value)
  },
  name: {
    username: ({ fields }) => fields.password && (fields.password.value === 'foo')
  }
};
```

### Application-wide
The recommended way is to provide the validation rules through `FormProvider`:

```jsx
// src/app/index.js
import React from 'react';
import { FormProvider } from 'react-advanced-form';
import validationRules from './validation-rules';

const App = ({ children }) => (
  <FormProvider rules={ validationRules }>
    { children }
  </FormProvider>
);
```

### From scope
Providing validation rules to a specific `<Form>` overrides the global (application-wide) validation rules applied by `<FormProvider>` (if any).

```jsx
// src/app/components/my-form.js
import React from 'react';
import { Form } from 'react-advanced-form';
import validationRules from '../../validation-rules';

export default class MyForm extends React.Component {
  render() {
    return (
      <Form rules={ validationRules }>
        ...
      </Form>
    );
  }
}
```
