# rule

## Specification

A synchronous rule applied to the field as the top priority validation. When the `rule` rejects, all the remaining validation chain is ignored.

## Definition

```typescript
type rule = RegExp | ({
  value: any, // The value of the current field
  fieldProps: Object|Map, // The props of the current field
  fields: Object|Map, // The state of the fields
  form: ReactComponent // Reference to the Form component
}) => Boolean
```

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

