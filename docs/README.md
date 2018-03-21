<h1 align="center">React Advanced Form</h1>

[![Package version](https://img.shields.io/npm/v/react-advanced-form.svg)](https://www.npmjs.com/package/react-advanced-form) [![Build status](https://img.shields.io/circleci/project/github/kettanaito/react-advanced-form/master.svg)](https://circleci.com/gh/kettanaito/react-advanced-form) [![Vulnerabilities](https://snyk.io/test/github/kettanaito/react-advanced-form/badge.svg)](https://snyk.io/test/github/kettanaito/react-advanced-form) [![Dependencies status](https://img.shields.io/david/kettanaito/react-advanced-form.svg)](https://david-dm.org/kettanaito/react-advanced-form) [![DevDepenencies status](https://img.shields.io/david/dev/kettanaito/react-advanced-form.svg)](https://david-dm.org/kettanaito/react-advanced-form?type=dev)

[React Advanced Form](https://github.com/kettanaito/react-advanced-form) is a library for tailoring real-world forms with pleasure and ease.

No boilerplate. No obscure high-order component configurations. No redundant state management. Embrace powerful custom styling, field grouping, advanced multi-level validation, validation messages with smart fallback system, reactive props resolvers and much more.

## Features
* **Boilterplate-free**. Remember how you were tossing tons of configurations for high-order components around each form? No more. Create clean and powerful forms without repeating yourself, without building crazy abstractions.

* [**Composite fields**](https://kettanaito.gitbooks.io/react-advanced-form/getting-started/creating-fields.html). Create gorgeous and flexible fields composites and reuse them throughout the entire application. Reflect even the most granular field state changes in the UI to achieve the outmost user experience.

* [**Intuitive usage**](https://kettanaito.gitbooks.io/react-advanced-form/getting-started/creating-form.html). Place a `Form` component, add some fields and the form is working without any extra effort:

```jsx
// No, ths is not a diminished example, this is a completely working form!
<Form action={ this.registerUser }>
  <Input name="username" required />
  <Input name="password" type="password" required />
</Form>
```

* [**Smart multi-layer validation**](https://kettanaito.gitbooks.io/react-advanced-form/validation/logic.html). Declare even the most complex validation logic using single-line resolver functions.

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

Access the field's `value`, `fieldProps`, `fields` and the `form` as the parameters of each resolver function. Apply the rules application-wide via `FormProvider`, or extend/override them for a specific form. Say goodbye to crowded `validate` functions, welcome clean multi-layer validation schemas!

* [**Reactive props**](https://kettanaito.gitbooks.io/react-advanced-form/architecture/reactive-props.html). How much effort would it take you to make one field required based on another field(s)? Yes, the correct answer is—*one line of code*:

```jsx
<Input
  name="firstName"
  required={({ fields }) => !!fields.lastName.value} />
<Input
  name="lastName"
  required={({ fields }) => !!fields.firstName.value} />
```

Embrace the power of reactive programming which resolves the prop values automatically whenever the referenced fields update.

* [**Field grouping**](https://kettanaito.gitbooks.io/react-advanced-form/components/Field.Group.html). Control the serialized data structure on the layout level by grouping the fields.

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

## Getting started
Please read the detailed step-by-step instruction on how to [Get started with React Advanced Form](https://kettanaito.gitbooks.io/react-advanced-form/getting-started/installation.html). The latter contains a thorough explanation of how the workflow with the form looks like, and how to easily integrate it into your project.

## Documenation
See the [Documentation](https://kettanaito.gitbooks.io/react-advanced-form) for the list of all available features, their descriptions and examples of usage.

## Contributing
Any of your contributions are highly appreciated. See the [Contribution guidelines](https://kettanaito.gitbooks.io/react-advanced-form/CONTRIBUTING.html) to get to know the process better. Moreover, development isn't the only way to contribute, there are [many more](https://kettanaito.gitbooks.io/react-advanced-form/CONTRIBUTING.html#other-contributions).

Found a bug? Eager to suggest a useful feature? The [Issues](https://github.com/kettanaito/react-advanced-form/issues) tab is always open for your ideas. Just make sure you're not duplicating the existing ones. If you feel lucky, you can even submit a [Pull request](https://github.com/kettanaito/react-advanced-form/pulls) with the changes.

## License
This project is licensed under [MIT License](https://github.com/kettanaito/react-advanced-form/blob/master/LICENSE.md). See the license file for more details.
