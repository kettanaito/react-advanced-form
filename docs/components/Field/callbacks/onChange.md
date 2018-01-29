# `Field.props.onChange`

## Specification
Event handler called after the field has been blurred out.

### Arguments

| Property name | Type | Description |
| ------------- | ---- | ----------- |
| `event` | `Event` | Native event instance reference. |
| `nextValue` | `mixed` | The next value of the field. |
| `prevValue` | `mixed` | The previous value of the field. |
| `fieldProps` | `Object` | Props of the current field. |
| `fields` | `Object` | Map of all fields. |
| `form` | `Object` | A reference to the current `Form` |

## Usage
```jsx
import React from 'react';
import { Form } from 'react-advanced-form';
import { Input } from 'react-advanced-form-addons';

export default class Example extends React.Component {
    handleUsernameChange = ({ event, nextValue, prevValue, fieldProps, fields, form }) => {
        // ...
    }

    render() {
        return (
            <Form>
                <Input
                    name="username"
                    onChange={ this.handleUsernameChange }
                    required />
            </Form>
        )
    }
}
```
