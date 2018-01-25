# Referencing

## Field
Passing `ref` prop to your custom field will return the reference to the `Field` class, *not* to the DOMElement directly.

```jsx
class MyForm extends React.Component {
  render() {
    return (
      <Form>
        <MyField ref={ field => this.fieldRef = field } name="foo" />
      </Form>
    )
  }
}
```

## DOMElement
In order to reference a DOMElement behind the field (which is `input`, `select`, etc.), please provide an `innerRef` prop to your custom field:

```jsx
class MyForm extends React.Component {
  handleButtonClick = (event) => {
    this.inputRef.focus();
  }

  render() {
    return (
      <Form>
        <MyField innerRef={ input => this.inputRef = input } name="foo" />
        <button onClick={ this.handleButtonClick }>Autofocus</button>
      </Form>
    )
  }
}
```

> **Note:** You can have both `ref` and `innerRef` props on your custom field at the same time.

## Nested DOMElement
When using third-party libraries which wrap the plain form components in their own components you need to map `innerRef` explicitly to return the reference to the DOMElement.

Do that by accessing an `innerRef` prop inside your custom field declaration:

```jsx
import { createField } from 'react-advanced-form';

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
