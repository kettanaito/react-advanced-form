# `Field.props.onBlur`

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
import { Form } from 'react-advanced-form';
import { Input } from 'react-advanced-form-addons';

export default class Example extends React.Component {
    handleUsernameBlur = ({ event, fieldProps, fields, form }) => {
        // ...
    }

    render() {
        return (
            <Form>
                <Input
                    name="username"
                    onBlur={ this.handleUsernameBlur }
                    required />
            </Form>
        )
    }
}
```
