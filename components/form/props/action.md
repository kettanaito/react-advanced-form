# action

## Specification

Action performed on the successful submit of the form.

## Definition

```typescript
type action = ({
  serialized: Object|Map, // Serialized fields of the form
  fields: Object|Map, // The state of all fields
  form: ReactComponent // Reference to the Form component
}) => Promise
```

## Example

```jsx
import React from 'react';
import { Form } from 'react-advanced-form';

export default class RegistrationForm extends React.Component {
  registerUser = ({ serialized, fields, form }) => {
    return fetch('...', {
      method: 'POST',
      body: JSON.stringify(serialized)
    });
  }

  render() {
    return (
      <Form action={ this.registerUser }>
        { /* ... */ }
      </Form>
    )
  }
}
```

> **Note:** `Form.props.action` will be called **only** when the form validation resolves. In other cases this handler is completely ignored, as it should be.

## Recommendations

* `action` should **always** return a `Promise`.
* You may return Redux actions dispatchers in the `action` handler, only ensure that Redux actions return a `Promise`.
* Name of the `action` handler should not begin with `on`, as it is not a callback handler.
* It is recommended to name `action` handlers relatively to what form must do by its design: `registerUser` for Registration form, `createPost` for creating a new post, etc.

