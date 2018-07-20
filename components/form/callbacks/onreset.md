# onReset

## Specification

A callback method called once `Form.reset()` is finished. Useful for reseting the values of the controlled fields, as `Form.reset()` affects only uncontrolled fields.

## Definition

```typescript
type OnReset = ({
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
    constructor() {
        super();
        this.state = {
            password: ''
        };
    }

    handleManualReset = (event) => {
        event.preventDefault();
        this.form.reset(); // resets uncontrolled fields ("username")
    }

    handleReset = ({ fields, form }) => {
        this.setState({ password: '' }); // manually reset controlled fields ("password")
    }

    render() {
        const { password } = this.state;

        return (
            <Form
                ref={ form => this.form = form }
                onReset={ this.handleReset }>
                <Input
                    name="username"
                    required />
                <Input
                    name="password"
                    value={ password }
                    onChange={ ({ nextValue }) => this.setState({ password: nextValue }) }
                    required />
                <button onClick={ this.handleManualReset }>Reset</button>
            </Form>
        );
    }
}
```

