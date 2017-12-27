# `Field.onChange`

## Specification
Event handler called after the field has been blurred out.

### Arguments

| Property name | Type | Description |
| ------------- | ---- | ----------- |
| `event` | `Event` | Native event instance reference. |
| `nextValue` | `mixed` | The next value of the field. |
| `prevValue` | `mixed` | The previous value of the field. |
| `fieldProps` | `Object` | Props of the current field. |
| `fields` | `Object` | Map of all fields after submit attempt. |
| `form` | `Object` | A reference to the submitted `Form` |

## Usage
```jsx
import React from 'react';
import { Form, Field } from 'react-advanced-form';

export default class MyForm extends React.Component {
    handleUsernameChange = ({ event, nextValue, prevValue, fieldProps, fields, form }) => {
        // ...
    }
    
    render() {
        return (
            <Form>
                <Field.Input
                    name="username"
                    onChange={ this.handleUsernameChange }
                    required />
            </Form>
        )
    }
}
```
