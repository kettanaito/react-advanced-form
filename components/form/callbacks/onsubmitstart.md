# onSubmitStart

## Specification

Called immediately on the submit attempt of the valid form. Useful for displaying a loader in the interface, acknowledging the user that the submit action is in progress.

## Definition

```typescript
type OnSubmitStart = ({
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

export default class Example extends React.Component {
    handleSubmitStart = ({ serialized, fields, form }) => {
        // ...
    }

    render() {
        return (
            <Form onSubmitStart={ this.handleSubmitStart }>
                <Input name="username" required />
                <button type="submit">Submit</button>
            </Form>
        );
    }
}
```

