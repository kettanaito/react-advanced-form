# React Advanced Form

<p>
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

[React Advanced Form](https://github.com/kettanaito/react-advanced-form) is a library which allows you to create simple and customizable forms with a powerful functionality built-in.

No boilerplate. No redundant state management. Embrace intuitive custom styling, field grouping, advanced multi-level validation, automatic validation messages, dynamic props and much more.

## Basic usage
### Introduce `FormProvider`
```jsx
// src/app/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { FormProvider } from 'react-advanced-form';
import validationRules from './validation-rules';
import validationMessages from './validation-messages';

const App = ({ children }) => (
  <FormProvider rules={ validationRules } messages={ validationMessages }>
    { children }
  </FormProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
```

### Create a custom form
```jsx
// src/app/components/MyForm.jsx
import React from 'react';
import { Form, Field } from 'react-adnvaced-form';

export default class MyForm extends React.Component {
  handleSubmit = ({ serialized }) => {
    return fetch('https://backend.dev/ws', {
      method: 'POST',
      body: JSON.stringify(serialized)
    });
  }

  render() {
    return (
      <Form action={ this.handleSubmit }>
        <Field.Input name="username" required />
        <Field.Input name="password" type="password" required />
        <Field.Radio name="gender" value="male" />
        <Field.Radio name="gender" value="female" />
        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```

Read more about how to use React Advanced Form to get the most out of its features in the [Official documentation](https://kettanaito.gitbooks.io/react-advanced-form).

## License
[MIT](https://github.com/kettanaito/react-advanced-form/blob/master/LICENSE)
