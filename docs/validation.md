# Form validation

## Introduction
Being able to efficiently validate the form in a way you need it, when you need it - is an essential requirement toward any form. This library has a flexible validation logic split into sever levels:

1. [Synchronous Field validation](#synchronous-field-validation)
2. [Synchronous Form validation](#synchronous-form-validation)
3. [Asynchronous Field validation](#asynchronous-field-validation)

Levels are sorted by their priority and order of execution during the form validation process.

## Synchronous Field validation
### `rule?: RegExp`
Each field can have its own synchronous (front-end) validation specified using `rule` prop:
```jsx
<Field.Input name="username" rule={/^\w+$/} />
```
> **Note:** The way field validation behaves depends by its `required` prop.

Keeping this in mind, the example above reads that the field will be validated *only* when it has value. Since it's not a required field, empty value is also an option.

At the same time, the following example will validate field as `missing` when it doesn't have a value, and `invalid` if its value doesn't match the provided `rule` expression:
```jsx
<Field.Input name="username" rule={/^\w+$/} required />
```

### Recommendations
While this functionality is certainly useful, it is recommended to use [Synchronous Form validation](#synchronous-form-validation) instead. This way you would not need to repeat the rules for each field's instance.

Synchronous Field validation is meant for the cases when a certain field should have the highest validation rule applied in a particular scenario. For other cases, each field should be validated against the Form's rules.

## Synchronous Form validation
This kind of validation is achieved by declaring a rules Object of the following structure:
```js
{
  type: {
    text: value => !!value,
    tel: value => validator(value),
    ...
  },
  name: {
    firstName: value => validator(firstName)
  }
}
```
* The root properties `type` and `name` are allowed.
* `type` expectes an Object of `[fieldType]: validator` structure.
* `name` expected an Object of `[fieldName]: validator` structure.
* Each `validator` function should return **Boolean**.
* Name-specific validation rules have higher priority and will resolve first, as compared to type-specific rules.

### Recommendations
The recommended way of using sync form validation is to pass the `rules` property to the `<FormProvider>` directly:
```jsx
<FormProvider rules={{
  type: {
    text: value => !!value
  },
  name: {
    username: value => /^\w+$/.test(value)
  }
}}>
  <div id="my-app">...</div>
</FormProvider>
```
This will pass the declared validation rules to each `<Form>` instantiated within the provider, regardless of the depth. In case of necessity, you may pass the custom `rules` Object to a certain form as well:
```jsx
<Form rules={{
  type: {
    text: value => value !== ''
  }
}}>
  ...
</Form>
```
This will re-write the global validation rules, granting you an explicit control over how your form is validated in this particular scenario.

## Asynchronous Field validation
### `asyncRule?: ({ value, fieldProps, formProps }) => Promise<boolean>`
This is the last entry in the validation chain. Async validation, as stated in its name, uses an async request to a remote end-point responsible for validating the field's value.

```jsx
<Form>
  <Field.Input
    name="username"
    asyncRule={({ value }) => {
      return fetch('https://backend.dev/validate/', {
        method: 'POST',
        body: JSON.stringify({
          username: value
        })
      });
    }} />
</Form>
```
> **Note:** Make sure to return a `Promise` in `asyncRule`.
