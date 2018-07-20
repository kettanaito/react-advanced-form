# serialize\(\)

## Specification

Performs a manual serialization of the current `Form`.

> **Note:** Manual serialization happens _regardless_ of the validation state of the form. This is almost never what you want. Make sure to perform Manual validation when serializing the form by yourself.

## Usage

```jsx
import React from 'react';
import { Form } from 'react-advanced-form';
import { Input } from 'react-advanced-form-addons';

export default class Example extends React.Component {
    handleClick = () => {
        this.form.serialize(); // { username: "admin" }
    }

    render() {
        return (
            <div>
                <Form ref={ form => this.form = form }>
                    <Input name="username" value="admin" />
                </Form>

                <button onClick={ this.handleClick }>Serialize</button>
            </div>
        );
    }
}
```

