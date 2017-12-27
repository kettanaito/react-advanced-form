# `Form.onInvalid`

## Specification
Called once the submit is prevented due to invalid validation state of the form. Useful for any kind of xustom logic based on the invalid fields.

### Arguments

| Property name | Type | Description |
| ------------- | ---- | ----------- |
| `invalidFields` | `Array<Object>` | Unordered list of invalid fields. |
| `fields` | `Object` | Map of all fields. |
| `form` | `Object` | A reference to the current `Form` |

## Usage
```jsx
import React from 'react';
import { Form, Field } from 'react-advanced-form';

export default class MyForm extends React.Component {
    handleInvalidForm = ({ invalidFields, fields, form }) => {
        // ...
    }

    render() {
        return (
            <Form onInvalid={ this.handleInvalidForm }>
                <Field.Input name="username" required />
                <button type="submit">Submit</button>
            </Form>
        );
    }
}
```
