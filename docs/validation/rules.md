# Validation rules

* [Definition](#definition)
* [Priority](#priority)
* [Named rules](#named-rules)
* [Multiple rules](#multiple-rules)
* [Extending rules](#extending-rules)
* [Example](#example)

## Definition

```ts
type ValidationRules = {
  extend?: boolean,
  type: {
    [fieldType: string]: RuleDefinition
  },
  name: {
    [fieldName: string]: RuleDefinition
  }
}

type RuleResolver = ({
  value: mixed, // (shorthand) the value of the current field
  fieldProps: Object, // props of the current field
  fields: Object, // map of all fields present in the same Form
  form: ReactComponent // reference to the Form itself
}) => boolean

type RuleDefinition = RuleResolver | { [ruleName: string]: RuleResolver;
```

A rule resolver function must always return a `boolean`, stating that the current state of the field satisfies the rule.

## Priority
Validation rules are executed by a certain priority.

### Context priority
A synchronous rule declared under [`Field.props.rule`](../components/Field/props/rule.md) has the highest priority and is executed first, if present.

### Selector priority
There are two kinds of validation selectors:

* `name`
* `type`

Name-specific validation rules always have higher priority over type-specific rules. That means whenever name-specific rule rejects, any following type-specific rules *will not be executed*.

## Named rules
Each rule may have its own unique name:

```jsx
export default {
  type: {
    email: {
      isValid: ({ value }) => isEmail(value)
    }
  }
}
```

Named rules allow to precisely control the validation messages displayed respectively to the rule's name. Read more about this in [Validation messages: Named resolvers](./messages.md#named-resolvers) section.

## Multiple rules
One field selector can have multiple rules declared at once:

```jsx
// src/validation-rules.js
export default {
  name: {
    userPassword: {
      capitalLetter: ({ value }) => /[A-Z]/.test(value),
      oneNumber: ({ value }) => /[0-9]/.test(value)
    }
  }
};
```

> **Note:** Each of the multiple validation rules **must be named**.

Multiple type-specific rules can be declared in the very same way.

Sibling rules are always executed in parallel, regardless of the resolving status of the siblings. Considering the example above, `oneNumber` rule will always be executed even if `capitalLetter` rule rejects.

## Referencing fields
As mentioned in the [Definition](#definition), resolver function exposes a `fields` object. This allows to reference another fields present in the same form, and base the validation logic on their state.

When the resolver function references any field using `fields` Object, this resolver gets executed each time the referenced prop of the referenced field updates. Consider the following example:

```js
{
  name: {
    confirmPassword: ({ value, fields }) => {
      return (value === fields.password.value);
    }
  }
}
```

The `[name="password"]` field is being referenced in the rule resolver above. Therefore, whenever the `value` prop of the `[name="password"]` field is changed, the `[name="confirmPassword"]` field is re-validated to reflect that changes. That is a built-in logic and is executed automatically.

## Extending rules
While having application-wide rules is the recommended approach, each `Form` instance can have its own validation rules, which may, or may not extend the application-wide rules.

To extend the application-wide rules set the `extend` to `true`:

```js
const customRules = {
  extend: true, // extend any rules from the higher scope
  name: {
      myField: ({ value }) => (value !== 'foo')
  }
};
```

## Example
As an example, we will be creating a real-world registraion form for our imaginary application. This should give you an overview of how you can manage validation in your project.

First, let's declare the validation rules:

```js
// src/app/validation-rules.js
import isEmail from 'validator/lib/isEmail';

export default {
  type: {
    email: ({ value }) => isEmail(value),
    password: {
      capitalLetter: ({ value }) => /[A-Z]/.test(value),
      oneNumber: ({ value }) => /[0-9]/.test(value)
    }
  }
};
```

Now, let's apply those rules to the whole application, making *all* forms in our app abide by those rules:

```jsx
// src/app/index.js
import React from 'react';
import { FormProvider } from 'react-advanced-form';
import validationRules from './validation-rules';

const renderApp = ({ children }) => (
  <FormProvider rules={ validationRules }>
    { children }
  </FormProvider>
);

// render the app using ReactDOM.render()
```

Now, let's declare a `RegistrationForm` component:

```jsx
// src/app/components/Registration/Form.jsx
import React from 'react';
import { Form } from 'react-advanced-form';
import { Input } from 'react-advanced-form-addons';

export default class RegistrationForm extends React.Component {
  render() {
    return (
      <Form action={ this.registerUser }>
        <Input
          name="email"
          type="email"
          required />
        <Input
          name="password"
          type="password"
          required />
        <Input
          name="confirmPassword"
          type="password"
          required />
      </Form>
    );
  }
}
```

Great! Our form is done, but let's take it one step further and declare some validation rules specific to this very form. We will use those to validate the `confirmPassword` field, to make sure it equals to the `password` field's value.

```js
// src/app/components/Registration/rules.js
export default {
  /**
   * Set "extend" to "true" because our RegistrationForm should abide
   * by the "email" and "password" application-wide rules shipped by
   * the <FormProvider> for all children forms.
   */
  extends: true,
  name: {
    confirmPassword: ({ value, fields }) => {
      return (value === fields.password.value);
    }
  }
}
```

Now let's pass this unique validation rules to our `RegistraionForm`:

```jsx
// src/app/components/Registration/Form.jsx
import React from 'react';
import { Form } from 'react-advanced-form';
import { Input } from 'react-advanced-form-addons';

/* Import form-specific rules */
import validationRules from './rules';

export default class RegistrationForm extends React.Component {
  render() {
    return (
      <Form
        action={ this.registerUser }
        rules={ validationRules }>
        <Input
          name="email"
          type="email"
          required />
        <Input
          name="password"
          type="password"
          required />
        <Input
          name="confirmPassword"
          type="password"
          required />
      </Form>
    );
  }
}
```
