# `Form.onSubmitStart`

## Specification
Called immediately on the submit attempt of the valid form. Useful for displaying a loader in the interface, acknowledging the user that the submit action is in progress.

### Arguments

| Property name | Type | Description |
| ------------- | ---- | ----------- |
| `serialized` | `Object` | Map of the serialized fields. |
| `fields` | `Object` | Map of all fields after submit attempt. |
| `form` | `Object` | A reference to the submitted `Form` |

## Usage
```jsx
import { Form, Field } from 'react-advanced-form';

export default class MyForm extends React.Component {
    handleSubmitStart = ({ serialized, fields, form }) => {
        // ...
    }

    render() {
        return (
            <Form onSubmitStart={ this.handleSubmitStart }>
                <Field.Input name="username" required />
                <button type="submit">Submit</button>
            </Form>
        );
    }
}
```
