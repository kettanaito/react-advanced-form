# onInvalid

## Specification

Called once the submit is prevented due to invalid validation state of the form. Useful for any kind of custom logic based on the invalid fields.

## Definition

```typescript
type OnInvalid = ({
  invalidFields: Object[]|Map[], // Unordered list of invalid fields
  fields: Object|Map, // The state of the fields
  form: ReactComponent // Reference to the Form component
}) => void
```

## Usage

```jsx
import React from 'react';
import { Form } from 'react-advanced-form';
import { Input } from 'react-advanced-form-addons';

export default class Example extends React.Component {
    handleInvalidForm = ({ invalidFields, fields, form }) => {
        // ...
    }

    render() {
        return (
            <Form onInvalid={ this.handleInvalidForm }>
                <Input name="username" required />
                <button type="submit">Submit</button>
            </Form>
        );
    }
}
```

