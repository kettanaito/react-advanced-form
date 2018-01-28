# `Field.props.rule`

## Specification
A synchronous rule applied to the field as the top priority validation. When the `rule` rejects, all the remaining validation chain is ignored.

## Definition
```ts
type rule = RegExp | ({ value, fieldProps, fields, form }) => Boolean
```

| Property name | Type | Description |
| ------------- | ---- | ----------- |
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
  render() {
    return (
      <Input
        name="username"
        rule={/^\d+/} />
    );
  }
}
```
