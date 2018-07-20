# onSubmitEnd

## Specification

Called immediately after the submit ended, regardless of the submit status \(on both successful and unsuccessful submit\). Useful for interface changes, such as hiding a loader, to acknowledge the user that the submit action has ended.

## Definition

```typescript
type OnSubmitEnd = ({
  res: Response, // Accumulated response of the async submit action
  serialized: Object|Map, // Serialized fields
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

