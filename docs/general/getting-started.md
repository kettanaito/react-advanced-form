# Getting started

The instructions below should guide you through the minimum required to get started with React Advanced Form. For more advanced usage and full overview of the features please see the respective documentation sections.

## Prerequisites
### Engines
* [NodeJS](https://nodejs.org) (6.0+)

### Peer dependencies
This library requires the [peer dependencies](https://nodejs.org/en/blog/npm/peer-dependencies/) listed below. It is your responsibility to install/have those in your project in order for React Advanced Form to function properly.
* [React](https://github.com/facebook/react) (15.0+)
* [ImmutableJS](https://github.com/facebook/immutable-js) (3.8+)

## Installation
Using NPM:
```
npm install react-advanced-form --save
```

Using Yarn:
```
yarn add react-advanced-form
```

## Usage

### Introduce the FormProvider

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { FormProvider } from 'react-advanced-form';
import validationRules from './path/to/your/validation/rules';
import validationMessages from './path/to/your/validation/messages';

const App = ({ children }) => (
    <FormProvider rules={ validationRules } messages={ validationMessages }>
        { children }
    </FormProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
```

`FormProvider` serves as a HOC to ensure all the `Form` components in your application abide by the provided `validationRules` and corresponding `validationMessages`.

> **Note: **Although `FormProvider` is not mandatory for the forms to work, it is highly recommended to handle application-wide validation this way. The latter ensures a consistent user and developer experience.

### Create a custom form

```jsx
import React from 'react';
import { Form, Field } from 'react-advanced-form';

export default class RegistrationForm extends React.Component {
    handleSubmit = ({ serialized }) => {
        return fetch('https://backend.dev/register', {
            method: 'POST',
            body: JSON.stringify(serialized)
        }).
    }

    render() {
        return (
            <Form action={ this.handleSubmit }>
                <Field.Input name="email" required />
                <Field.Input name="password" type="password" required />
                <button type="Submit">Register</button>
            </Form>
        );
    }
}
```

Now you have the `RegistrationForm` working with close to no effort.

> **Note: **Although this is a working example, you would rarely use `Field` component directly in your forms. You may want to read about Custom Styling to use form element which would stun your customers.