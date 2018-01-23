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

> Thank you for deciding to try React Advanced Form! Please note that before the `1.0` release the package is under heavy development. Things may change, and things may break. We are doing our best to release breaking changes in the proper versions of the library. Help us reach `1.0` faster by [Contributing](#contributing) to the library. Thank you.

[React Advanced Form](https://github.com/kettanaito/react-advanced-form) is a library for tailoring simple and flexible forms with a powerful functionality built-in.

No boilerplate. No redundant state management. Embrace intuitive custom styling, field grouping, advanced multi-level validation, automatic validation messages, dynamic props and much more.

## Getting started
### Prerequisites
* [NodeJS](https://nodejs.org) (6.0+)

#### Peer dependencies
React Advanced Form requires the [peer dependencies](https://nodejs.org/en/blog/npm/peer-dependencies/) listed below. It is your responsibility to install/have those in your project in order for it to function properly.
* [React](https://github.com/facebook/react) (15.0+)
* [ImmutableJS](https://github.com/facebook/immutable-js) (3.8+)

### Install
#### NPM:
```bash
npm install react-advanced-form --save
```

#### Yarn:
```bash
yarn add react-advanced-form
```

## Basic usage
```jsx
import React from 'react';
import { Form, Field } from 'react-advanced-form';

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

Read the [Official documentation](https://kettanaito.gitbooks.io/react-advanced-form) for more information on components, methods and usage examples.

## Contributing
Any of your contributions are highly appreciated. Please read the [Contribution guidelines](./docs/developers/contributing.md) before contributing to the library. Moreover, development isn't the only way to contribute, there are [many more](./docs/developers/contributing.md#other-contributions).

## License
This project is licensed under [MIT License](https://github.com/kettanaito/react-advanced-form/blob/master/LICENSE). See the license file for more details.
