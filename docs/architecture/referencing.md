# Referencing

## Field
Passing `ref` prop to your custom field will return the reference to the `Field` class, *not* to the DOM node directly.

```jsx
class MyForm extends React.Component {
  componentDidMount() {
    console.log(this.fieldRef);
    console.log(this.fieldRef.wrappedRef);
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

`this.fieldRef.wrappedRef` references to the component on which gets the destructed `...fieldProps` Object. This may be plain form element, or custom React component propagating those props to the plain form element.

## DOM node
In order to reference a DOM node behind the field (which is `input`, `select`, etc.), please provide an `innerRef` prop to your custom field:

```jsx
class MyForm extends React.Component {
  handleButtonClick = () => {
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

> **Note:** You can have both `ref` and `innerRef` props on the same custom field component at once.

> **Note:** `innerRef` will **not** work if the form element is returned by another React Component (for example, when using `styled-components`). See the [Nested DOM nodes](#nested-dom-node) reference example to handle those scenarios.

## Nested DOM node
When using third-party libraries which wrap the plain form components in their own components you need to map `innerRef` explicitly to return the reference to the DOMElement.

Do that by accessing an `innerRef` prop inside your custom field declaration:

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

> Do not be confused, as `StyledInput.props.innerRef` is the prop expected by `styled-components,` while `Input.props.innerRef` is the prop (a function) passed to the custom field component from the `createField()` wrapper.
