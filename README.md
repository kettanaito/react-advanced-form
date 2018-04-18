[![Package version](https://img.shields.io/npm/v/react-advanced-form.svg)](https://www.npmjs.com/package/react-advanced-form) [![Build status](https://img.shields.io/circleci/project/github/kettanaito/react-advanced-form/master.svg)](https://circleci.com/gh/kettanaito/react-advanced-form) [![Vulnerabilities](https://snyk.io/test/github/kettanaito/react-advanced-form/badge.svg)](https://snyk.io/test/github/kettanaito/react-advanced-form) [![Dependencies status](https://img.shields.io/david/kettanaito/react-advanced-form.svg)](https://david-dm.org/kettanaito/react-advanced-form) [![DevDepenencies status](https://img.shields.io/david/dev/kettanaito/react-advanced-form.svg)](https://david-dm.org/kettanaito/react-advanced-form?type=dev)

<br />

<p align="center">
  <img src="./logo.png" alt="React Advanced Form" />
</p>

<h1 align="center">React Advanced Form</h1>

[React Advanced Form](https://github.com/kettanaito/react-advanced-form) is a library for tailoring real-world forms in [React](https://reactjs.org/) with pleasure and ease.

No boilerplate. No obscure high-order component configurations. No redundant state management. Embrace powerful custom styling, field grouping, advanced multi-layer validation, validation messages with smart fallback system, reactive props resolvers and much more.

## Features
* **Boilterplate-free**. Remember how you were tossing tons of configurations for high-order components around each form? No more. Create clean and powerful forms without repeating yourself, without building crazy abstractions.

* [**Composite fields**](https://kettanaito.gitbooks.io/react-advanced-form/docs/getting-started/creating-fields.html). React Advanced Form is *field-centric*. That means you define flexible and reusable fields composites and reuse them throughout the entire application. Reflect even the most granular field state changes in the UI to achieve the outmost user experience.

* [**Intuitive usage**](https://kettanaito.gitbooks.io/react-advanced-form/docs/getting-started/creating-form.html). Place a `Form` component, add some fields and the form is working without any effort.

```jsx
// No, this is not a diminished example, this is a completely working form
<Form action={ this.registerUser }>
  <Input name="username" required />
  <Input name="password" type="password" required />
</Form>
```

* [**Smart multi-layer validation**](https://kettanaito.gitbooks.io/react-advanced-form/docs/validation/logic.html). Declare even the most complex validation logic using single-line resolver functions.

```js
export default {
  type: {
    password: {
      capitalLetter: ({ value }) => /[A-Z]/.test(value),
      oneNumber: ({ value }) => /[0-9]/.test(value)
    }
  },
  name: {
    confirmPassword: ({ value, fields }) => {
      /**
       * The "confirmPassword" field will be re-validated
       * whenever the "value" prop of "userPassword" field updates.
       */
      return (value === fields.userPassword.value);
    }
  }
};
```

Access the field's `value`, `fieldProps`, `fields` and the `form` as the parameters of each resolver function. Apply the rules application-wide via `FormProvider`, or extend/override them for a specific form. Say goodbye to crowded `validate` functions, welcome **clean validation schemas**!

* [**Reactive props**](https://kettanaito.gitbooks.io/react-advanced-form/docs/architecture/reactive-props.html). How much effort would it take you to make one field required based on another field(s)? Yes, the correct answer is—*one line of code*:

```jsx
<Input
  name="firstName"
  required={({ get }) => !!get(['lastName', 'value'])} />
<Input
  name="lastName"
  required={({ get }) => !!get(['firstName', 'value'])} />
```

Embrace the power of reactive programming, which re-evaluates the resolver function whenever the referenced field props update.

* [**Field grouping**](https://kettanaito.gitbooks.io/react-advanced-form/docs/components/Field.Group.html). Control the serialized data structure on the layout level by grouping the fields. Nested and split groups are supported.

```jsx
<Field.Group name="primaryInfo">
  <Input name="username" value="john.maverick" />
  <Input name="password" type="password" value="secret" />
</Field.Group>

<Checkbox name="termsAndConditions" checked />

<Field.Group name="primaryInfo">
  <Input name="firstName" value="John" />
  <Input name="lastName" value="Maverick" />
</Field.Group>
```

The layout above will be serialized into the following JSON:

```json
{
  "primaryInfo": {
    "username": "john.maverick",
    "password": "secret",
    "firstName": "John",
    "lastName": "Maverick"
  },
  "termsAndConditions": true
}
```

* **Third-party fields integration**. Love some third-party field component? Connect it to React Advanced Form and enjoy the benefits of both! Use exposed `createField` high-order component to create a field out of any component.

## Examples
See and play around with some sandbox examples:

* [Synchronous validation](https://codesandbox.io/s/53wlvmp42l?module=%2Fsrc%2FSyncValidation.js)
* [Asynchronous validation](https://codesandbox.io/s/73236qlk06?module=%2Fsrc%2FAsyncValidation.js)

## Getting started

### Install

```bash
npm install react-advanced-form --save
```

### Guidelines
Starting with something new may appear challenging. There is a step-by-step instructions on how to [Get started with React Advanced Form](https://kettanaito.gitbooks.io/react-advanced-form/docs/getting-started/installation.html), which ensure easy and clear integration process.

## Documenation
See the [Documentation](https://kettanaito.gitbooks.io/react-advanced-form) for the list of all available features, their descriptions and examples of usage.

Help to improve the documentation by submitting a [Pull request](https://github.com/kettanaito/react-advanced-form/pulls) with your ideas.

## Browser support
<table>
  <tr>
    <th>Chrome</th>
    <th>Firefox</th>
    <th>Safari</th>
    <th>iOS Safari</th>
    <th>Edge</th>
    <th>Internet Explorer</th>
  </tr>
  <tr>
    <td align="center">65+</td>
    <td align="center">57+</td>
    <td align="center">9+</td>
    <td align="center">8+</td>
    <td align="center">41+</td>
    <td align="center">–</td>
  </tr>
</table>

There is no official support for Internet Explorer. No features are tested to ensure working there. They may, or may not work. Microsoft has stopped IE support, and so should you application.

## Contributing
Any of your contributions are highly appreciated. See the [Contribution guidelines](https://kettanaito.gitbooks.io/react-advanced-form/docs/CONTRIBUTING.html) to get to know the process better. Moreover, development isn't the only way to contribute, there are [many more](https://kettanaito.gitbooks.io/react-advanced-form/docs/CONTRIBUTING.html#other-contributions).

Found an issue? Eager to suggest a useful feature? The [Issues](https://github.com/kettanaito/react-advanced-form/issues) tab is always open for your feedback. Just make sure you're not duplicating the existing tickets. If you feel lucky, you can even submit a [Pull request](https://github.com/kettanaito/react-advanced-form/pulls) with the changes.

## License
This project is published under [MIT License](https://github.com/kettanaito/react-advanced-form/blob/master/LICENSE.md). See the license file for more details.
