# skip

## Specification

* Excludes the field from the `serialized` Object upon any Form serialization.
* Doesn't affect other field behaviors \(i.e. skipped required fields still prevent form submit when empty/invalid\).
* Static prop \(**cannot** be controlled\).

## Definition

```typescript
type Skip = boolean
```

**Default value:** `false`

## Example

```jsx
import React from 'react';
import { Form } from 'react-advanced-form';
import { Input } from 'react-advanced-form-addons';

export default class Example extends React.Component {
  handleSubmit = ({ serialized }) => {
    console.log(serialized); // { "username": "admin", "password": "123" }
  }

  render() {
    return (
      <Form action={ this.handleSubmit }>
        <Input
          name="username"
          value="admin"
          required />
        <Input
          name="password"
          type="password"
          value="123"
          required />
        <Input
          name="confirmPassword"
          type="password"
          value="123"
          required
          skip />
      </Form>
    );
  }
}
```

