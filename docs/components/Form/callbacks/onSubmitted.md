# `Form.props.onSubmitted`

## Specification
Called immediately in case asynchronous submit action resolves.

### Arguments

| Property name | Type | Description |
| ------------- | ---- | ----------- |
| `res` | `Object` | An accumulated response Object of the async submit action. |
| `serialized` | `Object` | Map of the serialized fields. |
| `fields` | `Object` | Map of all fields after submit. |
| `form` | `Object` | A reference to the submitted `Form` |

## Usage
```jsx
import React from 'react';
import { Form } from 'react-advanced-form';
import { Input } from 'react-advanced-form-addons';

export default class RegistrationForm extends React.Component {
    handleUserRegistered = ({ res, serialized, fields, form }) => {
        // ...
    }

    render() {
        return (
            <Form onSubmitted={ this.handleUserRegistered }>
                <Input name="username" required />
                <button type="submit">Submit</button>
            </Form>
        );
    }
}
```

> **Note:** It's a good practice to name the `onSubmitted` callback methods relatively to the form's primary action. For "Registration" form - `onUserRegistered`, for "Add product to Cart" form - `onProductAdded`, etc.
