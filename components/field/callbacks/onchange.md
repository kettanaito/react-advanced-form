# onChange

## Specification

Event handler called after the field has been blurred out.

## Definition

```typescript
type OnChange = ({
  event: Event, // Native event reference
  prevValue: any, // The previous value of the field
  nextValue: any, // The next value of the field
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

