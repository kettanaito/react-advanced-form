# Customization

* [Custom fields](#custom-fields)
* [Custom styling](#custom-styling)

## Introduction
One of the benefits of React Advanced Form is the architecture it is designed on. The latter allows flexible and clean customizations, such as creating or styling your custom fields, supported natively.

## Custom fields
React Advanced Form cannot and should not predict what business and implementation requirements you may be working with. We do not decide for you, we help you.

To create a custom field, use the dedicated [`createField()`](../hoc/createField.md) high-order component.

```jsx
import React from 'react';
import { createField } from 'react-advanced-form';

class MyComponent extends React.Component {
  render() {
    return (<AnyComponent { ...this.props } />);
  }
}

export default createField()(MyComponent);
```

Read more on how to use `createField()`, the supported options and usage examples in the [respective section of the documentation](../hoc/createField.md).

## Custom styling
Modern web practices almost never tend to use form elements styled using agent's stylesheet, neither React Advanced Form does. You should be in charge of the layout and styles of the fields you use.

This is one of the core concepts of RAF - to have a clear separation between the functionality and appearance of the form elements. With that achieved, styling the fields or migrating an already existing fields solutions is made extremily easy.

Use [`connectField()`](../hoc/connectField.md) high-order component to style the fields, with the latter preserving the native behavior and features.

```jsx
import React from 'react';
import { connectField, Field } from 'react-advanced-form';

class MyComponent extends React.Component {
  render() {
    const { valid, invalid } = this.props;

    return (
      <div className="field-container">
        <Field.Input { ...this.props } />

        { valid && (<Icon name="check" />) }
        { invalid && (<Icon name="cross" />) }
      </div>
    );
  }
}

export default connectField(MyComponent);
```

Read more on custom styling and its examples in the [respective section of the documentation](../hoc/connectField.md).
