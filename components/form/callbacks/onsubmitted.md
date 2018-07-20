# onSubmitted

## Specification

Called immediately in case asynchronous submit action resolves.

## Definition

```typescript
type OnSubmitted = ({
  res: Response, // Accumulated response from the async submit action
  serialized: Object|Map, // Serialized fields
  fields: Object|Map, // The state of the fields
  form: ReactComponent // Reference to the Form component
}) => void
```

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

