# Validation rules
**Spec:** [Validation rules](../validation/rules.md)

## Introduction
One of the purposes of the form is to ensure the expected format of the entered data. Unlike other form solutions where the developer is exposed a single `validate` function, React Advanced Form uses smart built-in algorithm of validations based on the schemas.

This part is going to focus on how to declare a validation schema and write the rules. We are going apply the validation rules and messages to the forms in the next part.

It is highly recommended to read the [Validation rules](../validation/rules.md) section of the documentation, which has more profound explanation on how the validation works.

## Implementation

### Schema
All validation rules reside in the respective schema. The latter is a plain JavaScript Object of a defined structure, which is used by React Advanced Form to apply the appropriate validation to the fields.

Let's create an empty validation schema with no rules for now:

```js
// app/validation-rules.js
export default {};
```

### Field selectors

To create a validation rule for a certain field we need to select that field first. We can select a field by its `type` or by its `name`.

> **Note:** If a field has both `type` and `name` validation rules they are going to be executed sequentially: name-specific rule first, then type-specific rules *only* in case the previous ones resolved.

Let's target the `[type="email"]` fields and provide an e-mail validation.

```jsx
// app/validation-rules.js
import isEmail from 'validator/lib/isEmail';

export default {
  type: {
    email: ({ value, fieldProps, fields, form }) => isEmail(value)
  }
};
```

The above reads that all the fields with the type `email` are going to be validated using the provided resolver function.

As the next step, let's create a more specific validation rule that will cover the `[name="confirmPassword"]` fields, for example:

```js
// app/validation-rules.js
export default {
  ...

  name: {
    confirmPassword: ({ value, fieldProps, fields, form }) => {
      return (value === fields.userPassword.value);
    }
  }
};
```

The rule above implies that `[name="confirmPassword"]` field is valid only when its value equals to the value of `[name="userPassword"]` sibling field.

> Notice how we can reference the other fields within the same form by the provided `fields` argument property.

### Multiple rules
One field selector can have multiple rules. Each rule must have its unique name.

Let's create multiple rules for `[type="password"]` fields, providing a realistic password validation throughout the application:

```js
// app/validation-rules.js
export default {
  type: {
    password: {
      capitalLetter: ({ value }) => /[A-Z]/.test(value),
      oneNumber: ({ value }) => /[0-9]/.test(value),
      minLength: ({ value }) => (value.length > 5)
    }
  }
};
```

> Multiple validation rules of the same selector have the same priority and are applied simultaneously. Therefore, it is possible to have miltiple failing rules at the same time, reflected by multiple error messages.

We can also use the rule names to provide a rule-specific error messages later, when we are going to declare validation messages.

### Asynchronous validation
Unlike the rules above, asynchronous rules do not reside in the validation schema.

To create an asynchronous rule we need to use the [`asyncRule`](../components/Field/props/asyncRule.md) prop on the exact field we want to validate. As an example, let's validate the user e-mail address using asynchronous validation:

```jsx
import React from 'react';
import { Form } from 'react-advanced-form';
import { Input } from './components';

export default class ExampleForm extends React.Component {
  validateEmail = ({ value, fieldProps, fields, form }) => {
    return fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(value)
    }).then((res) => {
      const valid = (res.statusCode === 'success');

      return {
        valid,
        errorCode: res.errorCode
      };
    });
  }

  render() {
    return (
      <Form>
        <Input
          name="userEmail"
          type="email"
          asyncRule={ this.validateEmail }
          required />
      </Form>
    );
  }
}
```

Asynchronous validation resolver must always return a Promise, which resolves into the Object of the following structure:

```ts
{
  valid: boolean,
  [extraProp: string]: any
}
```

All the `extraProp` properties returned within the Object are avilable in the validation message resolver.
