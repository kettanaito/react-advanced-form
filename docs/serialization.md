# Serialization

## Introduction
Form serialization (reducing the values of fields to a plain Object) is handled internally in the `<Form>` component. It is not recommended to interfere with it, and, in general, you would never really want that.

> **Note:** Read about [`Field.Group`](./components/Field.Group.md) to organize your fields' data on a markup level, which keeps your `handleSubmit` logic light and smooth.

## Manual serialization
However, there are cases when you may require to serialize the form "from outside".

```jsx
export default class MyForm extends React.Component {
  serializeForm = () => {
    const serialized = this.myForm.serialize(); // { fieldOne: "foo" }
  }

  render() {
    return (
      <Form ref={ form => this.myForm = form }>
        <Field.Input name="fieldOne" value="foo" />
      </Form>
    );
  }
}
```

> **Note:** Manual serialization happens **regardless** of the validation status. That means, you need to ensure the form is valid before serializing it (read more on [Manual validation](./validation.md#manual-validation)), unless you intend to serialize it in either case.
