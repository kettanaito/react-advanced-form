# Introduction

[![Package version](https://img.shields.io/npm/v/react-advanced-form.svg)](https://www.npmjs.com/package/react-advanced-form) [![Build status](https://img.shields.io/circleci/project/github/kettanaito/react-advanced-form/master.svg)](https://circleci.com/gh/kettanaito/react-advanced-form) [![Vulnerabilities](https://snyk.io/test/github/kettanaito/react-advanced-form/badge.svg)](https://snyk.io/test/github/kettanaito/react-advanced-form) [![Dependencies status](https://img.shields.io/david/kettanaito/react-advanced-form.svg)](https://david-dm.org/kettanaito/react-advanced-form) [![DevDepenencies status](https://img.shields.io/david/dev/kettanaito/react-advanced-form.svg)](https://david-dm.org/kettanaito/react-advanced-form?type=dev) ![Discord](https://img.shields.io/discord/443325109311373313.svg)

![React Advanced Form](../.gitbook/assets/logo.png)

## React Advanced Form

[React Advanced Form](https://github.com/kettanaito/react-advanced-form) is a library for tailoring real-world forms in [React](https://reactjs.org/) with pleasure and ease.

No boilerplate. No obscure high-order component configurations. No redundant state management. Embrace powerful custom styling, field grouping, advanced multi-layer validation, validation messages with smart fallback system, reactive props resolvers and much more.

### Features

* **Boilterplate-free**. Remember tossing tons of configurations for high-order components to forms? No more. Create clean and powerful forms without repeating yourself, without building crazy abstractions.
* **Immutable**. Rest asured as all the fields are controlled using immutable data structures that makes their updates efficient and side-effect free.
* [**Composite fields**](https://kettanaito.gitbooks.io/react-advanced-form/docs/getting-started/creating-fields.html). React Advanced Form is _field-centric_. That means you define flexible fields composites and reuse them throughout the entire application. Reflect even the most granular field state changes in the UI to achieve the outmost user experience.
* [**Intuitive usage**](https://kettanaito.gitbooks.io/react-advanced-form/docs/getting-started/creating-form.html). Place a `Form` component, add some fields and the form is working without extra effort.

```jsx
// No, this is not a diminished example, this is a completely working form
<Form action={this.registerUser}>
  <Input name="username" required />
  <Input name="password" type="password" required />
</Form>
```

* [**Smart multi-layer validation**](https://kettanaito.gitbooks.io/react-advanced-form/docs/validation/logic.html). Declare even the most complex validation logic using single-line resolver functions.

```javascript
export default {
  type: {
    password: {
      capitalLetter: ({ value }) => /[A-Z]/.test(value),
      oneNumber: ({ value }) => /[0-9]/.test(value)
    }
  },
  name: {
    confirmPassword: ({ value, get }) => {
      /**
       * The "confirmPassword" field will be re-validated
       * whenever the "value" prop of "userPassword" field updates.
       */
      return value === get(["userPassword", "value"]);
    }
  }
};
```

Access the field's `value`, `fieldProps`, `fields` and the `form` as the parameters of each resolver function. Apply the rules application-wide via `FormProvider`, or extend/override them for a specific form. **Say goodbye to crowded** `validate` **functions, welcome clean validation schemas**!

* [**Reactive props**](https://kettanaito.gitbooks.io/react-advanced-form/docs/architecture/reactive-props.html). How much effort would it take you to make one field required based on another field\(s\)? Yes, the correct answer is—_one line of code_:

```jsx
<Input
  name="firstName"
  required={({ get }) => !!get(['lastName', 'value'])} />
<Input
  name="lastName"
  required={({ get }) => !!get(['firstName', 'value'])} />
```

Get as many data from the sibling fields as needed, and build your logic on that. Embrace the power of reactive programming, which re-evaluates a resolver function whenever the referenced field props update.

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

```javascript
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

* **Third-party fields integration**. Love a third-party field library? Connect it to React Advanced Form and enjoy the benefits of both! Use exposed `createField` high-order component to create a field out of any component.

### Getting started

#### Peer dependencies

Make sure to have the following packages installed in your project:

* [React](https://github.com/facebook/react) \(15.0+\)
* [Immutable](https://github.com/facebook/immutable-js) \(3.8+\)

#### Install

```bash
npm install react-advanced-form --save
```

#### Guidelines

Starting with something new may appear challenging. There is a step-by-step instructions on how to [Get started with React Advanced Form](https://kettanaito.gitbooks.io/react-advanced-form/docs/getting-started/installation.html), which ensure easy and clear integration process.

### Resources

* [Documentation](https://kettanaito.gitbooks.io/react-advanced-form)
* [Advanced forms in React made easy](https://medium.com/@kettanaito/advanced-forms-in-react-made-easy-92a6e208f017) \(Medium\)

### Browser support

| Chrome | Firefox | Safari | iOS Safari | Edge | Internet Explorer |
| --- | --- |
| 65+ | 57+ | 9+ | 8+ | 41+ | – |

> There is no official support for Internet Explorer. No features are tested to ensure working there. They _may_, or _may not_ work. Microsoft has stopped IE support, and so should you application.

### Live examples

* [Synchronous validation](https://codesandbox.io/s/53wlvmp42l?module=%2Fsrc%2FSyncValidation.js)
* [Asynchronous validation](https://codesandbox.io/s/73236qlk06?module=%2Fsrc%2FAsyncValidation.js)

### Contributing

Any of your contributions are highly appreciated. See the [Contribution guidelines](https://kettanaito.gitbooks.io/react-advanced-form/docs/CONTRIBUTING.html) to get to know the process better. Moreover, development isn't the only way to contribute, there are [many more](https://kettanaito.gitbooks.io/react-advanced-form/docs/CONTRIBUTING.html#other-contributions).

Found an issue? Eager to suggest a useful feature? The [Issues](https://github.com/kettanaito/react-advanced-form/issues) tab is always open for your feedback. Just make sure you're not duplicating the existing tickets. If you feel lucky, you can even submit a [Pull request](https://github.com/kettanaito/react-advanced-form/pulls) with the changes.

### License

This project is published under [MIT License](https://github.com/kettanaito/react-advanced-form/blob/master/LICENSE.md). See the license file for more details.

