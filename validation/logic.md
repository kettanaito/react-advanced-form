# Logic

The purpose of this section is to give you an overview of the available validation methods, their sequence and their priority. Please read more about how to declare the validation rules and validation messages in the respective documentation sections.

## Sequence

The validation of fields happens in a defined sequence. It is important to understand that whenever the previous validation chain fails, the next one is not going to be called. This way there is no unnecessary validation, resource-wise and UX-wise.

Each step of the validation is meant to prepare the field for the next step of the validation. Together, they provide a predictable and stable validation experience when working with the forms.

To explain the sequence of the validation let's consider the example below. It is going to be the most expanded example, meaning there will be all the validation chains possible. That is solely for demonstrational purposes, you should define those validations necessary for your specific needs. On the same note, there will be no validation messages set, since those do not contribute to the validation algorithm, but are rather an outcome of the validation.

```jsx
import React from 'react';
import { FormProvider, Form } from 'react-advanced-form';
import { Input } from 'react-advanced-form-addons';

/* Application-wide validation rules */
const validationRules = {
  type: {
    text: ({ value }) => !!value
  },
  name: {
    username: ({ value, fieldProps, fields, form }) => {
      return (value !== 'admin');
    }
  }
};

/* Form-specific validation rules */
const formRules = {
  /**
   * Validation rules extension.
   * When set to "true", both form and application validation rules are taken into account.
   * When set to "false", form-specific rules override the application-wide rules,
   * and the latter are not taken into account.
   */
  extend: true,
  name: {
    username: ({ value, fieldProps, fields, form }) => {
      return (value !== 'foo');
    }
  }
};

export default class App extends React.Component {
  validateUsername = ({ value, fieldProps, fields, form }) => {
    return fetch('https://backend.dev/user/validate', {
      method: 'POST',
      body: JSON.stringify({ username: value })
    });
  }

  render() {
    return (
      <FormProvider rules={ validationRules }>
        <Form rules={ formRules }>
          <Input
            type="text" // default value, present for clarity
            name="username"
            rule={/[^0-9]/}
            asyncRule={ this.validateUsername }
            required />
          <Input
            name="firstName"
            rule={({ value, fieldProps, fields, form }) => {
              return (value !== 'foo');
            }}
            asyncRule={ ... } />
        </Form>
      </FormProvider>
    );
  }
}
```

> **Note:** Since "firstName" field is not `required`, it will not be validated unless provided some value. At the current state of the form it would submit gracefully since the value of "firstName" is `null`. Once the value is provided, it will undergo through the same validation sequence as listed below.

Upon submitting the form, the following validation sequence will happen:

### Synchronous validation

The purpose of the synchronous validation is to ensure the current value of the Field is expected by the remote end-point of the asynchronous validation \(if any\).

1. `Field.props.rule`
2. `formRules.name.username`
3. `formRules.type.text`
4. `applicationRules.name.username`
5. `applicationRules.type.text`

### Asynchronous validation

1. `Field.props.asyncRule`

> **Note:** All the validation steps listed above are optional, but the sequence they are called is exact.

