# `Field.onFocus`

## Specification
Event handler called after the field has been focused.

### Arguments

| Property name | Type | Description |
| ------------- | ---- | ----------- |
| `event` | `Event` | Native event instance reference. |
| `fieldProps` | `Object` | Props of the current field. |
| `fields` | `Object` | Map of all fields after submit attempt. |
| `form` | `Object` | A reference to the submitted `Form` |

## Usage
```jsx
import React from 'react';
import { Form, Field } from 'react-advanced-form';

export default class MyForm extends React.Component {
    handleUsernameFocus = ({ event, fieldProps, fields, form }) => {
        // ...
    }
    
    render() {
        return (
            <Form>
                <Field.Input
                    name="username"
                    onFocus={ this.handleUsernameFocus }
                    required />
            </Form>
        )
    }
}
```
