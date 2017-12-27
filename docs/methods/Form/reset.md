# `Form.reset()`

## Specification
Resets the values of the unctronolled fields of the `Form` to their initial values.

> **Note:** `Form.reset()` will not affect controlled fields. To reset the latter use [`Form.onReset`](../../callbacks/Form/onReset.md) callback method handler, which is called after `Form.reset()` is finished.

## Usage
### Using submit callback handlers
```jsx
import React from 'react';
import { Form, Field } from 'react-advanced-form';

export default class MyForm extends React.Component {
  handleSubmitted = ({ res, fields, form }) => {
    form.reset(); // resets "username" field to "admin"
  }

  render() {
    return (
      <Form onSubmitted={ this.handleSubmitted }>
        <Field.Input name="username" initialValue="admin" />
      </Form>
    );
  }
}
```

### Using `Form` reference
```jsx
import React from 'react';
import { Form, Field } from 'react-advanced-form';

export default class MyForm extends React.Component {
  handleButtonClick = () => {
    this.form.reset(); // resets "username" field to "admin"
  }

  render() {
    return (
      <div>
        <Form ref={ form => this.form = form }>
          <Field.Input name="username" initialValue="admin" />
        </Form>
        <button onClick={ this.handleButtonClick }>Reset</button>
      </div>
    );
  }
}
```
