<p align="center">
  <img src="./logo.png" alt="React Advanced Form" />
</p>

<h1 align="center">React Advanced Form</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/react-advanced-form">
    <img src="https://img.shields.io/npm/v/react-advanced-form.svg" title="Latest version" />
  </a>
  <a href="#">
    <img src="https://circleci.com/gh/kettanaito/react-advanced-form/tree/master.svg?style=shield" title="Build status" />
  </a>
  <a href="https://david-dm.org/kettanaito/react-advanced-form" title="Dependencies status">
    <img src="https://david-dm.org/kettanaito/react-advanced-form/status.svg" />
  </a>
  <a href="https://david-dm.org/kettanaito/react-advanced-form?type=dev" title="devDependencies status">
    <img src="https://david-dm.org/kettanaito/react-advanced-form/dev-status.svg" />
  </a>
</p>

## Overview
* [Installation](#installation)
* [Getting started](#getting-started)
* **Components:**
  * [Field.Group](./docs/components/Field.Group.md)
* **Form workflow:**
  * [Form validation](./docs/validation.md)
  * [Validation states](./docs/validation-states.md)
  * [Serialization](./docs/serialization.md)
  * [Handle form submit](./docs/submit.md)
* **Other:**
  * [Custom styling](./docs/custom-styling.md)
* [FAQ (Freqently asked questions)](./FAQ.md)

## Installation
```
npm install react-advanced-form --save
```

## Getting started
### Use the provider
A good point to start is to include `FormProvider` on the root-level of your application:

```jsx
// src/app/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { FormProvider } from 'react-advanced-form';
import validationRules from './path/to/validation/rules';
import validationMessages from './path/to/validation/messages';

const App = ({ children }) => (
  <FormProvider rules={ validationRules } messages={ validationMessages }>
    { children }
  </FormProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
```

By doing so, *all* the forms in your application will abide by the provided [validation rules](./docs/validation-rules.md) and corresponding validation messages. Although the `FormProvider` is not necessary for the forms to work, it is recommended for real-world applications to reduce code repetition and ensure a solid user and developer experience.

### Build a custom form
```jsx
// src/app/components/registration-form.js
import React from 'react';
import { Form, Field } from 'react-advanced-form';

export default class RegistrationForm extends React.Component {
  handleSubmit = ({ fields, serialized, formProps }) => {
    const { username, password } = serialized;

    return fetch('https://backend.dev/register', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password
      });
    });
  }

  render() {
    return (
      <Form action={ this.handleSubmit }>
        <Field.Input name="username" required />
        <Field.Input name="password" type="password" required />
        <button type="submit">Register</button>
      </Form>
    );
  }
}
```
You have a perfectly working form with close to no extra effort.

Oh, did I mention that "advanced" in the name is for a reason? Embrace the full power of `react-advanced-form` by reading its [Documentation](./docs).
