# Referencing

* [General](referencing.md#general)
* [Form reference](referencing.md#form)
* [Field reference](referencing.md#field)
* [Nested element node](referencing.md#nested-element-node)

## General

There are two kinds of referencing - _component_ and _element_ references.

Component reference returns you the `React.Component` instance \(i.e. `<Form>` or `<CustomField>`\). Element reference returns you an `HTMLElement` instance rendered by the component \(i.e. `<form>`, `<input>` or `<select>`\). Both are useful for different scenarios and can be accessed as described below.

## Form

### Component reference

```jsx
class MyForm extends React.Component {
  componentDidMount() {
    console.log(this.formRef); // Form component
    console.log(this.formRef.innerRef); // <form> element

    this.formRef.validate(); // access internal methods
  }

  render() {
    return (
      <Form
        ref={ form => this.formRef = form } />
    );
  }
}
```

### Inner reference

Reference the actual `<form>` element by providing the `innerRef` prop to the `Form` component:

```jsx
class MyForm extends React.Component {
  componentDidMount() {
    console.log(this.formElement); // <form> element
  }

  render() {
    return (
      <Form innerRef={ element => this.formElement = element } />
    );
  }
}
```

> You can also access the inner reference by referencing the `Form` component and taking its `innerRef` property: `this.formRef.innerRef`. This is the same as providing `Form.props.innerRef` directly.

## Field

### Component reference

Reference the field component by providing the `ref` prop.

```jsx
class MyForm extends React.Component {
  componentDidMount() {
    console.log(this.fieldRef); // Field component
    console.log(this.fieldRef.innerRef); // field element (i.e. "input")
  }

  render() {
    return (
      <Form>
        <MyField ref={ field => this.fieldRef = field } name="foo" />
      </Form>
    )
  }
}
```

### Inner reference

To reference the actual form element behind the field use `innerRef` prop.

```jsx
class MyForm extends React.Component {
  componentDidMount() {
    console.log(this.fieldElement); // field element (i.e. "input")
    this.fieldElement.focus();
  }

  render() {
    return (
      <Form>
        <MyField innerRef={ element => this.fieldElement = element } name="foo" />
      </Form>
    )
  }
}
```

> **Beware** that `innerRef` will always reference the component where `Field.props.fieldProps` get destructed. You must always propagate the essential field props to the actual form element for both proper functioning and referencing.
>
> `innerRef` **will not** work if the form element is returned by another React Component \(for example, when using `styled-components`\). See the [Nested element node](referencing.md#nested-element-node) reference example to handle those scenarios.

## Nested element node

When using third-party libraries which wrap the plain form components in their own components you need to map `innerRef` explicitly to return the reference to the `HTMLElement`.

Do so by accessing an `innerRef` prop inside your custom field component declaration:

```jsx
import { createField } from 'react-advanced-form';
import styled from 'styled-components';

/* Custom styled component */
const StyledInput = styled.input`
  ...
`;

class Input extends React.Component {
  render() {
    const { innerRef, fieldProps } = this.props;

    return (
      <StyledInput
        { ...fieldProps }
        innerRef={ innerRef } />
    );
  }
}

export default createField()(Input);
```

> Do not be confused, as `StyledInput.props.innerRef` is the prop expected by `styled-components,` while `Input.props.innerRef` is the prop \(a function\) passed to the custom field component from the `createField()` wrapper. Different third-party solutions may expose different interface to accept the inner reference function.

