# `Form.onInvalid`

## Specification
Called once the submit is prevented due to invalid validation state of the form. Useful for any kind of xustom logic based on the invalid fields.

### Arguments

| Property name | Type | Description |
| ------------- | ---- | ----------- |
| `invalidFields` | `Array<Object>` | Unordered list of invalid fields. |
| `fields` | `Object` | Map of all fields after submit attempt. |
| `form` | `Object` | A reference to the submitted `Form` |

## Usage
```jsx
import { Form, Field } from 'react-advanced-form';

export default class MyForm extends React.Component {
    handleInvalidForm = ({ invalidFields, fields, form }) => {
        // ...
    }

    render() {
        return (
            <Form onInvalid={ this.handleInvalidForm }>
                <Field.Input name="username" required />
                <button type="submit">Submit</button>
            </Form>
        );
    }
}
```