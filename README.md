[![Package version](https://img.shields.io/npm/v/react-advanced-form.svg)](https://www.npmjs.com/package/react-advanced-form) [![Build status](https://img.shields.io/circleci/project/github/kettanaito/react-advanced-form/master.svg)](https://circleci.com/gh/kettanaito/react-advanced-form) [![Vulnerabilities](https://snyk.io/test/github/kettanaito/react-advanced-form/badge.svg)](https://snyk.io/test/github/kettanaito/react-advanced-form) [![Dependencies status](https://img.shields.io/david/kettanaito/react-advanced-form.svg)](https://david-dm.org/kettanaito/react-advanced-form) [![DevDepenencies status](https://img.shields.io/david/dev/kettanaito/react-advanced-form.svg)](https://david-dm.org/kettanaito/react-advanced-form?type=dev) [![Greenkeeper badge](https://badges.greenkeeper.io/kettanaito/react-advanced-form.svg)](https://greenkeeper.io/)

<p align="center">
  <img src="./logo.png" alt="React Advanced Form" />
</p>

<h1 align="center">React Advanced Form</h1>

[React Advanced Form](https://github.com/kettanaito/react-advanced-form) is a library for tailoring real-world forms in [React](https://reactjs.org/) with pleasure and ease.

---

# Features

## Expectations shift

Trust and expect a form to do more than just rendering the fields. Our features are designed to handle cumbersome use cases with clean and performant code

## Immutable

Each field interaction or update is a pure function that produces the next state of a field.

## [Composite fields](https://redd.gitbook.io/react-advanced-form/getting-started/creating-fields)

React Advanced Form is _field-centric_. That means you define flexible fields composites and reuse them throughout the application. Reflect even the most granular field state changes in the UI to achieve the outmost user experience.

```jsx
import React from 'react'
import { createField, fieldPresets } from 'react-advanced-form'

const Input = ({ fieldState, fieldProps }) => {
  const { valid, invalid } = fieldState

  const classNames = [valid && 'has-success', invalid && 'has-error'].filter(
    Boolean,
  )

  return <input {...fieldProps} className={classNames.join(' ')} />
}

export default createField(fieldPresets.input)(Input)
```

## Clean and fast

Develop production-ready forms in a speed of a prototype.

```jsx
// This is not a diminished example, this is a finite form
<Form action={this.registerUser}>
  <Input name="username" required />
  <Input name="password" type="password" required />
</Form>
```

## [Layered validation schema](https://redd.gitbook.io/react-advanced-form/validation/getting-started)

Select fields and declare validation rules using resolver functions. Utilize the order and priority of their execution to craft validation logic of any complexity.

```js
export default {
  type: {
    password: {
      capitalLetter: ({ value }) => /[A-Z]/.test(value),
      oneNumber: ({ value }) => /[0-9]/.test(value),
    },
  },
  name: {
    confirmPassword: ({ get, value }) => {
      /**
       * The "confirmPassword" field will be re-validated whenever
       * the "value" prop of "userPassword" field updates.
       */
      return value === get(['userPassword', 'value'])
    },
  },
}
```

Each validation resolver can access respective field's `value`, `fieldProps`, and the `form` as the parameters. It can also reference other field's state via the `get` function, which creates a props subscription to re-evaluate the respective validation rule in real time.

**Say goodbye to crowded** `validate` **functions, welcome clean validation schema**!

## [**Reactive props**](https://redd.gitbook.io/react-advanced-form/architecture/reactive-props)

How much effort would it take you to make one field required based on another field\(s\)? Yes, the correct answer is—_one line of code_:

```jsx
<Input
  name="firstName"
  required={({ get }) => !!get(['lastName', 'value'])} />
<Input
  name="lastName"
  required={({ get }) => !!get(['firstName', 'value'])} />
```

Get as many data from the sibling fields as needed, and build your logic around that. Rely on reactive programming that will re-evaluate a resolver function whenever the referenced field props update.

## [Field grouping](https://redd.gitbook.io/react-advanced-form/components/field-group)

Control the serialized data structure on the layout level by grouping the fields. Take advantage of nested and split groups.

```jsx
<Input name="companyName" value="Google" />

<Field.Group name="billingAddress">
  <Input name="firstName" value="John" />
  <Input name="lastName" value="Maverick" />
</Field.Group>

<Checkbox name="termsAndConditions" checked />

<Field.Group name="deliveryAddress">
  <Input name="firstName" value="Catheline" />
  <Input name="lastName" value="McCoy" />
</Field.Group>
```

The form above serializes into the following JSON:

```json
{
  "companyName": "Google",
  "billingAddress": {
    "firstName": "John",
    "lastName": "Maverick"
  },
  "termsAndConditions": true,
  "deliveryAddress": {
    "firstName": "Catheline",
    "lastName": "McCoy"
  }
}
```

## Third-party integration

React Advanced Form can be used with **any** third-party fields library by using powerful [`createField`](https://redd.gitbook.io/react-advanced-form/hoc/create-field) API. It also allows to create custom fields from literally any component.

---

# Getting started

## Install

```bash
npm install react-advanced-form --save
```

> Make sure to have [React](https://github.com/facebook/react) \(15.0+\) installed in your project.

## Guidelines

Starting with something new may appear challenging. We have prepared step-by-step instructions on how to [Get started with React Advanced Form](https://redd.gitbook.io/react-advanced-form/getting-started/installation) to make the adoption process clear and fast.

---

# Materials

- [**Documentation**](https://redd.gitbook.io/react-advanced-form)
- ["Advanced forms in React made easy"](https://medium.com/@kettanaito/advanced-forms-in-react-made-easy-92a6e208f017) — Artem Zakharchenko \(Medium\)

---

# Browser support

| Chrome | Firefox | Safari | iOS Safari | Edge | Internet Explorer |
| ------ | ------- | ------ | ---------- | ---- | ----------------- |
| 65+    | 57+     | 9+     | 8+         | 41+  | 11\*              |

> \* There is no official support for Internet Explorer. Consider educating the web and deprecating legacy browsers.

---

# Live examples

- [Synchronous validation](https://codesandbox.io/s/53wlvmp42l?module=%2Fsrc%2FSyncValidation.js)
- [Asynchronous validation](https://codesandbox.io/s/73236qlk06?module=%2Fsrc%2FAsyncValidation.js)

---

# Contributing

Any of your contributions are highly appreciated. Please read through the [Contribution guidelines](https://redd.gitbook.io/react-advanced-form/developers/contributing) beforehand. Development isn't the only way to support, there are [many more](https://redd.gitbook.io/react-advanced-form/developers/contributing#other-contributions).
