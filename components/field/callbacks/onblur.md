# onBlur

## Specification

Event handler called after the field has been blurred out.

## Definition

```typescript
type OnBlur = ({
  event: Event, // Native event reference
  fieldProps: Object|Map, // The props of the current field
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

