# `Field.onBlur`

## Specification
Event handler called after the field has been blurred out.

### Arguments

| Property name | Type | Description |
| ------------- | ---- | ----------- |
| `event` | `Event` | Native event instance reference. |
| `fieldProps` | `Object` | Props of the current field. |
| `fields` | `Object` | Map of all fields. |
| `form` | `Object` | A reference to the current `Form` |

## Usage
```jsx
import React from 'react';
import { Form, Field } from 'react-advanced-form';

export default class MyForm extends React.Component {
    handleUsernameBlur = ({ event, fieldProps, fields, form }) => {
        // ...
    }
    
    render() {
        return (
            <Form>
                <Field.Input
                    name="username"
                    onBlur={ this.handleUsernameBlur }
                    required />
            </Form>
        )
    }
}
```
