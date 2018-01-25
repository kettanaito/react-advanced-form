# Validation messages

## Introduction
Having an ability to display different validation messages at different states of the validation is a common requirement toward any modern form. Just as with the validation rules, we have refined an approach of declaring validation messages which serves gracefully in full-scale applications.

## Specification

### Message groups

| Group name | Description |
| ---- | ----------- |
| `general` | The least specific, general validation messages. Those are the values used as fallback when other message groups are not present. |
| `type` | Type-specific messages  |
| `name` | The highest priority, name-specific messages control  |

### Message types

| Type | Description |
| ---- | ----------- |
| `missing` | The field's value is required, but missing. |
| `invalid` | The field's value is not expected (doesn't match the provided rules). Applied always once the field has `rule` or `asyncRule` specified. |
| `async` | Asynchronous messages. The most flexible ones, async messages let you define custom logic based on the current state of the field and form, as well as on the received async validation payload. |

### Resolver format
The values supplied to the mentioned groups are expected to be in a certain format.

```ts
{
  [messageGroup: string]: {
    [messageType: string]: string | ({ value, fields, fieldProps, form, res, ...extra }) => string
  }
}
```

Message value can be a plain `string` or a resolver function which returns a string. The resolver function accepts the following argument properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `value` | `mixed` | The value of the validated field. |
| `fields` | `Object` | The current state of all the fields in the form. |
| `fieldProps` | `Object` | The props of the current field (the one getting validated). |
| `form` | `Object` | The current state of the form. |
| `res` | `mixed` | A payload from the `asyncRule` function. It allows you to map error messages from back-end directly, or create a custom logic based on whichever response properties you need. |
| `...extra` | `mixed` | Custom properties return within the `asyncRule` resolved Object. |

## Example
You would generally want to create and maintain validation messages at one place, probably, next to your validation rules.

```js
// src/app/validation-rules.js
export default {
  general: {
    missing: 'Please provide the required field.', // message for any missing field
    invalid: 'Please provide a proper value.' // message for any field which value doesn't match the provided rules
  },
  type: {
    tel: {
      missing: 'Please provide the phone number.', // message for any input[type="tel"] with missing value
      invalid: 'The phone number you provided is invalid.' // message for any input[type="tel"] with value not matching the specified rules
    }
  },
  name: {
    username: {
      missing: 'Please provide the username.', // message for "username" field with missing value
      invalid: 'Please type only letters into the field.', // message for "username" field which value doesn't match the provided rules
      async: {
        userExists: ({ backendMessage }) => {
          return backendMessage; // return the property from the response payload directly
        }
      }
    }
  }
};
```

```jsx
// src/app/components/MyForm.jsx
import React from 'react';
import { Form } from 'react-advanced-form';
import { Input } from 'react-advanced-form-addons';
import validationMessages from '../validation-messages';

export default class MyForm extends React.Component {
  /**
   * Validates the provided username.
   * Note: There are multiple properties exposed to your validation logic by React Advanced Form.
   */
  validateUsername = ({ value: username, fieldProps, fields, form }) => {
    return fetch('https://backend.dev/user/validate', {
      method: 'POST',
      body: JSON.stringify({ username })
    })
    .then(res => res.json())
    .then((payload) => {
      return {
        valid: (payload.statusCode === 'SUCCESS'),
        backendMessage: payload.message // available as "backendMessage" in resolver arguments
      }
    });
  }

  render() {
    return (
      <Form messages={ validationMessages }>
        <Input
          name="username"
          asyncRule={ this.validateUsername }
          required />
      </Form>
    );
  }
}
```



