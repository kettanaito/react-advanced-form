# Handle submit

## Introduction
In the end, it's all about sending the gathered data somewhere. We will take the most common scenario – sending the serialized form data to the remote end-point.

## Implementation
We can handle form submit by providing the [`action`](../components/Form/props/action.md) prop to our form:

```jsx
import React from 'react';
import { Form } from 'react-advanced-form';

export default class ExampleForm extends React.Component {
  render() {
    return (
      <Form action={ this.registerUser }>
        { /* ... */ }
      </Form>
    );
  }
}
```

The `action` prop expects a function which returns a Promise. By returning the latter Form can properly react to the Promise status, which is a submit request status at the same time.

```jsx
import React from 'react';
import { Form } from 'react-advanced-form';

export default class ExampleForm extends React.Component {
  registerUser = ({ serialized, fields, form }) => {
    return fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(serialized)
    });
  }

  render() {
    return (
      <Form action={ this.registerUser }>
        { /* ... */ }
      </Form>
    );
  }
}
```
