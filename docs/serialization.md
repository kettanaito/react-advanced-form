# Serialization

## Introduction
Form serialization (reducing the values of fields to a plain Object) is handled internally in the `<Form>` component. It is not recommended to interfere with it, and, in general, you would never really need that.

> **Note:** Read about [`Field.Group`](./components/Field.Group.md) to organize your fields' data on a markup level. Keep your `handleSubmit` logic light and smooth.

## Manual serialization
However, there are cases when you may require to serialize the form "from outside". This is the advised way to do so:

1. Get the reference of the form's component by providing the `ref` prop:
```jsx
<Form ref={ form => this.myForm = form }>
  <Field.Input name="inputOne" value="foo" />
</Form>
```

2. Call `Form.serialize()` method when you need it:
```js
handleManualSerialization = () => {
  const serialized = this.myForm.serialize();
}
```

This will return the following Object in the given example:
```js
{
  inputOne: 'foo'
}
```

> **Note:** When called manually, you will always receive a serialized form data, **regardless of the validation state**. You should perform [Manual validation](./validation.md#manual-validation) first, to ensure that the data is ready to be used.