# React Advanced Form

[![Package version](https://img.shields.io/npm/v/react-advanced-form.svg)](https://www.npmjs.com/package/react-advanced-form) [![Build status](https://img.shields.io/circleci/project/github/kettanaito/react-advanced-form/master.svg)](https://circleci.com/gh/kettanaito/react-advanced-form) [![Code factor](https://www.codefactor.io/repository/github/kettanaito/react-advanced-form/badge)](https://www.codefactor.io/repository/github/kettanaito/react-advanced-form) [![Vulnerabilities](https://snyk.io/test/github/kettanaito/react-advanced-form/badge.svg)](https://snyk.io/test/github/kettanaito/react-advanced-form) [![Dependencies status](https://img.shields.io/david/kettanaito/react-advanced-form.svg)](https://david-dm.org/kettanaito/react-advanced-form) [![DevDepenencies status](https://img.shields.io/david/dev/kettanaito/react-advanced-form.svg)](https://david-dm.org/kettanaito/react-advanced-form?type=dev)

> Thank you for trying React Advanced Form! Please note that before the `1.0` release the package is under heavy development. Things may change, and things may break. We are doing our best and releasing breaking changes in the proper versions. Help us reach `1.0` faster by [Contributing](#contributing) to the library. Thank you.

[React Advanced Form](https://github.com/kettanaito/react-advanced-form) allows you to tailor complex forms using declerative simplistic components and built-in powerful functionality. A form how it should be.

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
    <td align="center">Dozens of use cases have been refined to provide the flexible validation to suit <strong>them all</strong>.</td>
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
    <td align="center">Create custom styles for fields to suit your requirements like you have never experienced before.</td>
    <td align="center">Love some external field library? Connect it with RAF and enjoy the benefits of both!</td>
    <td align="center">Know precisely what happens with the Form and react to that by the exposed callback methods.</td>
  </tr>
</table>

There are also [field grouping](https://kettanaito.gitbooks.io/react-advanced-form/components/Field.Group.html), dynamic props, API to create fields with your own custom logic, and much more.

<br>

## Getting started
### Prerequisites
* [NodeJS](https://nodejs.org) (6.0+)

#### Peer dependencies
This package requires the [peer dependencies](https://nodejs.org/en/blog/npm/peer-dependencies/) listed below to function properly. It is your responsibility to install/have those in your project, alongside the installation of the package itself.
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
import { Input, Radio } from 'react-advanced-form-addons';

export default class RegistrationForm extends React.Component {
  registerUser = ({ serialized, fields, form }) => {
    return fetch('https://backend.dev/user', {
      method: 'POST',
      body: JSON.stringify(serialized)
    });
  }

  render() {
    return (
      <Form action={ this.registerUser }>
        <Input name="username" required />
        <Input name="password" type="password" required />

        <Radio name="gender" value="male" />
        <Radio name="gender" value="female" />

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```

> **Note:** For illustrational purposes [`react-advanced-form-addons`](https://github.com/kettanaito/react-advanced-form-addons) is used in the example above. That is a package designed for fast form prototyping using React Advanced Form. You *don't need* to use that package in your projects.

See the [Official documentation](https://kettanaito.gitbooks.io/react-advanced-form) for more information on components, methods and usage examples.

## Contributing
Any of your contributions are highly appreciated. Please read the [Contribution guidelines](./docs/CONTRIBUTING.md) before contributing to the library. Developing isn't the only way to contribute – there are [many more](./docs/CONTRIBUTING.md#other-contributions).

## License
This project is licensed under [MIT License](https://github.com/kettanaito/react-advanced-form/blob/master/LICENSE.md). See the license file for more details.
