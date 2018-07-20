# Validation rules

**Spec:** [Validation rules](../validation/rules.md)

## Introduction

One of the purposes of the form is to ensure the expected format of the entered data. Unlike other form solutions where the developer is exposed a single `validate` function, React Advanced Form uses smart built-in algorithm of validations based on the schemas.

This part is going to focus on how to declare a validation schema and write the rules. We are going apply the validation rules and messages to the forms in the next part.

It is highly recommended to read the [Validation rules](../validation/rules.md) documentation, which has more profound explanation on how the validation works.

## Implementation

### Schema

All validation rules reside in the respective schema. The latter is a plain JavaScript Object of a defined structure, which is used by React Advanced Form to apply the appropriate validation to the targeted fields.

Let's create an empty validation schema with no rules for now:

```javascript
// app/validation-rules.js
export default {};
```

### Field selectors

To validate a field we need to select it first within our validation rules schema. We can select a field by its `type` or `name`, or both.

> **Note:** If a field has both `type` and `name` validation rules they are going to be executed sequentially: name-specific rules first, then type-specific rules _only_ in case the previous ones have resolved.

After a field is selected, we are going to provide a _resolver_ function, which is going to determine whether the field is valid.

Let's select the fields with the type `email` and provide a respective validation to them:

```jsx
// app/validation-rules.js
import isEmail from 'validator/lib/isEmail';

export default {
  type: {
    email: ({ value, fieldProps, fields, form }) => isEmail(value)
  }
};
```

This rule automatically validates all fields with the type `email` using the provided resolver function. Notice the variety of the arguments exposed to the resolver function to craft any validation logic possible.

Following up, let's create a more specific validation rule that will cover the `[name="confirmPassword"]` fields, for example:

```javascript
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

The rule above implies that `[name="confirmPassword"]` field is valid only when its value equals to the value of `[name="userPassword"]` field of the same form.

**Any rule resolver which references another fields using the** `fields` **Object gets automatically re-resolved once the referenced fields update.** For example, our `[name="confirmPassword"]` field will be re-validated any time the `value` prop of `fields.userPassword` changes, out of the box. This ensures real time responsiveness of validation in our form. Read more in [Referencing fields](../validation/rules.md#referencing-fields)

### Multiple rules

One field selector can have multiple rules. Each rule must have its unique name.

Let's create multiple rules for `[type="password"]` fields, providing a realistic password validation throughout the application:

```javascript
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

We can also use the rule names to provide a rule-specific error messages later, when we are going to declare the [Validation messages](validation-messages.md).

### Explicit `rule`

The rules above feature the global validation schema, which is being applied to all fields matching the selectors. However, it is also possible to provide a synchronous validation rule to specific fields, without having to put the resolvers into the validation schema.

We can use a `rule` prop of any field to achieve that:

```jsx
<Input
  name="userName"
  rule={({ value, fieldProps, fields, form }) => {
    return value.test(/[a-z]/);
  }}
  required />
```

The value of the `rule` prop is exactly the same resolver function you would provide within the validation schema.

> Note that the `rule` prop resolver on the field component has the _highest_ priotity in the validation sequence.

### Asynchronous validation

Similar to the [Explicit `rule` prop](validation-rules.md#explicit-rule), asynchronous rules do not reside in the global validation schema.

To create an asynchronous rule we need to use the [`asyncRule`](../components/field/props/asyncrule.md) prop on the exact field we want to validate. As an example, let's validate the user e-mail address using asynchronous validation:

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

Asynchronous validation resolver must always return a Promise, which resolves into the Object with the following structure:

```typescript
{
  valid: boolean,
}
```

The `valid` property indicates whether the field value is valid. Any extra properties passed with the resolved Object are going to be available in the async message resolver. This way you can share the async response data with the validation message to craft extremely dynamic message logic.

