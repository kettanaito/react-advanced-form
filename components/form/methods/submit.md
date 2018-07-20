# submit\(\)

## Specification

* `submit: () => Promise<SubmitState>`

Performs a manual submit of the current `Form`. Submit function returns a Promise which resolves into different `SubmitState` Objects.

> **Note:** Manual submit of the form is **not the recommended** way to submit your forms. Use native submit event whenever applicable. Manual submit may be justified in case of complex submit logic \(i.e. submit of multiple independent forms at once\).

You still need to provide `Form.props.action` for internal submit logic to know what suppose to happen on submit.

## Usage

```jsx
import React from 'react';
import { Form } from 'react-advanced-form';
import { Input } from 'react-advanced-form-addons';

export default class Example extends React.Component {
    handleSubmit = () => {
        // Make sure to return a Promise here
    }

    handleClick = () => {
        this.form.submit().then((submitState) => {
            // This is called after the Promise of `this.handleSubmit` resolves/rejects
        });
    }

    render() {
        return (
            <div>
                <Form
                    ref={ form => this.form = form }
                    action={ this.handleSubmit }>
                    <Input name="username" required />
                </Form>

                <a href="#" onClick={ this.handleClick }>Submit manually</a>
            </div>
        );
    }
}
```

