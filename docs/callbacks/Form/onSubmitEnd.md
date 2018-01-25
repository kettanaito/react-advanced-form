# `Form.onSubmitEnd`

## Specification
Called immediately after the submit ended, regardless of the submit status (on both successful and unsuccessful submit). Useful for interface changes, such as hiding a loader, to acknowledge the user that the submit action has ended.

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

export default class MyForm extends React.Component {
    handleSubmitEnd = ({ res, serialized, fields, form }) => {
        // ...
    }

    render() {
        return (
            <Form onSubmitEnd={ this.handleSubmitEnd }>
                <Input name="username" required />
                <button type="submit">Submit</button>
            </Form>
        );
    }
}
```
