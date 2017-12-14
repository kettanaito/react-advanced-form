# Getting started

The instructions below should guide you through the minimum required to get started with React Advanced Form. For more advanced usage and full overview of the features please see the respective API sections.

## Prerequisites

You need to install \(ensure\) the following peer dependencies in your project:

* [Node](https://nodejs.org/en/) \(version &gt;= 5\)
* [React](https://reactjs.org/) \(version &gt;= 15\)
* [ImmutableJS](https://facebook.github.io/immutable-js/) \(version &gt;= 3.8\)

## Installation

Install React Advanced form via NPM:

```
npm install react-advanced-form --save
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