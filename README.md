# React Advanced Form

<p>
  <a href="https://www.npmjs.com/package/react-advanced-form" target="_blank">
    <img src="https://img.shields.io/npm/v/react-advanced-form.svg" title="Latest version" />
  </a>
  <a href="https://circleci.com/gh/kettanaito/react-advanced-form/tree/master" target="_blank">
    <img src="https://circleci.com/gh/kettanaito/react-advanced-form/tree/master.svg?style=shield" title="Build status" />
  </a>
  <a href="https://www.codefactor.io/repository/github/kettanaito/react-advanced-form" title="Code review" target="_blank">
    <img src="https://www.codefactor.io/repository/github/kettanaito/react-advanced-form/badge" />
  </a>
  <a href="https://david-dm.org/kettanaito/react-advanced-form" title="Dependencies status" target="_blank">
    <img src="https://david-dm.org/kettanaito/react-advanced-form/status.svg" />
  </a>
  <a href="https://david-dm.org/kettanaito/react-advanced-form?type=dev" title="devDependencies status" target="_blank">
    <img src="https://david-dm.org/kettanaito/react-advanced-form/dev-status.svg" />
  </a>
</p>

> Thank you for deciding to try React Advanced Form! Please note that before the `1.0` release the package is under heavy development. Things may change, and things may break. We are doing our best to release breaking changes in the proper versions of the library. Help us reach `1.0` faster by [Contributing](#contributing) to the library. Thank you.

[React Advanced Form](https://github.com/kettanaito/react-advanced-form) is a library for tailoring simple and flexible forms with a powerful functionality built-in.

No boilerplate. No redundant state management. Embrace intuitive custom styling, field grouping, advanced multi-level validation, automatic validation messages, dynamic props and much more.

## Features

<table>
  <tr>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <th>Boilerplate-free</th>
    <th>Intuitive usage</th>
    <th>Smart multi-layer validation</th>
  </tr>
  <tr>
    <td align="center">Stop wasting time on redundant state management of forms, and start <i>creating</i> forms in the end!</td>
    <td align="center">You place a <code>Form</code> component, declare the fields and your form is working without extra effort.</td>
    <td align="center">Dozens of use cases have been refined to provide you flexible validation to suit <strong>them all</strong>.</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <th>Custom styling</th>
    <th>Third-party libraries support</th>
    <th>Built-in Form callbacks</th>
  </tr>
  <tr>
    <td align="center">Create custom styles of fields for your project like you have never done before.</td>
    <td align="center">Love external field library? Connect it with RAF and enjoy <br>the benefits of both!</td>
    <td align="center">Know precisely what happens with the Form and react to that by the provided callback methods.</td>
  </tr>
</table>
<br>

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

### Basic usage
```jsx
import React from 'react';
import { Form, Field } from 'react-advanced-form';
import { Input, Radio, Checkbox } from 'react-advanced-form-addons';

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
        <Input name="username" required />
        <Input name="password" type="password" required />

        <Radio name="gender" value="male" />
        <Radio name="gender" value="female" />

        <Checkbox name="subscribe" />

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```

> **Note:** We are using [`react-advanced-form-addons`](https://github.com/kettanaito/react-advanced-form-addons) package in this example. It's designed for fast form prototypes based on React Advanced Form.

Read the [Official documentation](https://kettanaito.gitbooks.io/react-advanced-form) for more information on components, methods and usage examples.

## Contributing
Any of your contributions are highly appreciated. Please read the [Contribution guidelines](./docs/developers/contributing.md) before contributing to the library. Moreover, development isn't the only way to contribute – there are [many more](./docs/developers/contributing.md#other-contributions).

## License
This project is licensed under [MIT License](https://github.com/kettanaito/react-advanced-form/blob/master/LICENSE). See the license file for more details.
