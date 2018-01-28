# `Form.onSubmitStart`

## Specification
Called immediately on the submit attempt of the valid form. Useful for displaying a loader in the interface, acknowledging the user that the submit action is in progress.

### Arguments

| Property name | Type | Description |
| ------------- | ---- | ----------- |
| `serialized` | `Object` | Map of the serialized fields. |
| `fields` | `Object` | Map of all fields. |
| `form` | `Object` | A reference to the current `Form` |

## Usage
```jsx
import React from 'react';
import { Form } from 'react-advanced-form';
import { Input } from 'react-advanced-form-addons';

export default class MyForm extends React.Component {
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
