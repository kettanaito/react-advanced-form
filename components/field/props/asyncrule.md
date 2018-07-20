# asyncRule

## Specification

Asynchronous rule of the field applied as the top priority validation _after_ its sibling [`Field.props.rule`](rule.md) resolves. Executed on field blur.

* `asyncRule` is designed for on blur asynchronous validation of the fields.
* `asyncRule` is designed for precise unique field validation, and cannot be declared in the general [Validation rules](../../../validation/rules.md).
* `asyncRule` must always return the specified `AsyncRulePayload` Object.
* `asyncRule` will not be called if it has been previously resolved and the value of the field has not changed.

## Definition

```typescript
type AsyncRule = ({
  value: any, // The current value of the field
  fieldProps: Object|Map, // The props of the current field
  fields: Object|Map, // The state of the fields
  form: ReactComponent // Reference to the Form component
}) => AsyncRulePayload

type AsyncRulePaylod = {
  valid: Boolean,
}
```

| Argument | Type | Description |
| --- | --- | --- |
| `value` | `mixed` | The current value of the field. |
| `fieldProps` | `Object` | Props of the current field. |
| `fields` | `Object` | Map of all fields. |
| `form` | `Object` | A reference to the current `Form` |

## Example

```jsx
import React from 'react';
import { Form } from 'react-advanced-form';
import { Input } from 'react-advanced-form-addons';

export default class Example extends React.Component {
  validateUsername = ({ value, fieldProps, fields, form }) => {
    return fetch('https://check.if/user/exists', {
      method: 'POST',
      body: JSON.stringify(value)
    })
    .then(res => res.json())
    .then((res) => {
      const { statusCode } = res;

      return {
        valid: (statusCode === 'SUCCESS')
      };
    });
  }

  render() {
    return (
      <Form>
        <Input
          name="username"
          asyncRule={ this.validateUsername } />
      </Form>
    );
  }
}
```

