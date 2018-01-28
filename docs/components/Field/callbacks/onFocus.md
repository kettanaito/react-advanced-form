# `Field.onFocus`

## Specification
Event handler called after the field has been focused.

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
import { Form } from 'react-advanced-form';
import { Input } from 'react-advanced-form-addons';

export default class Example extends React.Component {
    handleUsernameFocus = ({ event, fieldProps, fields, form }) => {
        // ...
    }

    render() {
        return (
            <Form>
                <Input
                    name="username"
                    onFocus={ this.handleUsernameFocus }
                    required />
            </Form>
        )
    }
}
```
