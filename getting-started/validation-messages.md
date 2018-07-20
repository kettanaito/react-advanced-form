# Validation messages

**Spec:** [Validation messages](../validation/messages.md)

## Introduction

There is no point of validation if it is not properly reflected in the UI to help the user pass it fast and pleasantly.

In this part we are going to focus on how to declare the validation messages, and on the built-in functionality which helps us to craft the most advanced logic using one-line functions.

## Implementation

### Keywords

To reduce the duplication, messages have a list of keywords which correspond to the pre-defined validation statuses of the field.

| Keyword | Description |
| --- | --- |
| `missing` | Applied to empty required field. |
| `invalid` | Applied to the field with unexpected value. |
| `async` | Applied in case async validation of the field fails. |
| `rule` | Collection of custom messages mapped to [Named rules](validation-rules.md#multiple-rules). |

### Field selectors

Similar to the [Validation rules](validation-rules.md#field-selectors), validation messages are based on field selectors. We can select the fields based on `type` and `name`. However, there is also an additional `general` selector, which acts like a fallback for the rules without a specific message.

Declaring a `general` messages is a good place to start.

```javascript
// app/validation-messages.js
export default {
  general: {
    missing: 'Please provide the required field',
    invalid: 'The value you provided is invalid'
  }
};
```

The same keywords can be applied to any selector:

```javascript
export default {
  general: { ... },

  type: {
    email: {
      missing: 'Please provide an e-mail'
    }
  },

  name: {
    confirmPassword: {
      missing: 'Please confirm the password',
      invalid: 'The passwords do not match'
    }
  }
};
```

> Note that `missing` and `invalid` keywords are optional. In case the respective keyword is not found for the selector, it will use the closest keyword with the same type. Read more about the [Fallback system](validation-messages.md#fallbacks).

### Specific messages

To bind a certain message to a rule we need to list it under the `rule` keyword of the field selector.

Let's apply some custom messages to multiple validation rules of `[type="password"]` field we [declared earlier](validation-rules.md#multiple-rules):

```javascript
// src/validation-messages.js
export default {
  general: { ... },

  type: {
    password: {
      rule: {
        capitalLetter: 'Please include at least one capital letter',
        oneNumber: 'Please include at least one number'
      }
    }
  }
};
```

Rule-specific messages have the following format:

```typescript
{
  rule: {
    [ruleName: string]: MessageResolver
  }
}
```

### Message resolvers

Each message accepts a string or a function as its value.

This is how we can use a function to resolve the validation message:

```javascript
// src/validation-messages;
export default {
  ...,

  name: {
    confirmPassword: {
      invalid: ({ value }) => `The "${value}" is not a correct password`
    }
  }
};
```

### Fallbacks

With a smart fallback system we can be sure a proper message is always displayed to notify the user of the validation status. Fallback system returns the closest message matching the keyword, when there is no specific message found.

Take a look at the example below.

```javascript
// app/validation-messages.js
export default {
  general: {
    missing: 'abc'
  },

  type: {
    password: {
      invalid: 'foo'
    }
  }
};
```

Notice that `messages.type.password` selector doesn't have a `missing` message. That _doesn't_ mean that the invalid state of the password will not be reflected in the UI. Instead, React Advanced Form will automatically grab the closest message of the same type - which is `messages.general.missing` in this case.

Read more on the [Fallbacks](../validation/messages.md#fallbacks) in the respective section of the documentation.

