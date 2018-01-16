# `createField(options: CreateFieldOptions)`

## Specification
A high-order component which enhances the provided custom component (`WrappedComponent`) to behave as a native field.

> **Note:** It is important to understand how React Advanced Form works first. This will reduce the amount of questions when using `createField`.

## Usage scenarios
* Implementation of custom fields.
* Integration of third-party form components to work with React Advanced Form.

## Declaration
```jsx
import React from 'react';
import { createField } from 'react-advanced-form';

class CustomComponent extends React.Component {
  render() {
    return (<MyComponent { ...this.props.fieldProps } />);
  }
}

export default createField({ ... })(CustomComponent);
```

> **Note:** It's crucial to propagate the `CustomComponent.props.fieldProps` to the `MyComponent` for it to have the essential props and event handlers of the native field.

## Options
| Option | Type | Description |
| ------ | ---- | ----------- |
| `valuePropName` | `string` | A custom prop name to be treated as an updatable value during the field event handlers. **Default:** `value`. |
| `mapPropsToField` | `(props: Object, context: Object) => Object` | A custom maping function which should return a props Object used as the initial props during the field registration. |s
| `enforceProps` | `(props: Object, contextProps: Immutable.Map) => Object` | A function which should return a props Object to be enforced on the custom field. |

### `valuePropName`
Sometimes the property updated during the `onChange` event of the field is not a `value` prop. For those occasions provide the name of the property within the high-order component declaration.

```jsx
import React from 'react';
import { createField } from 'react-advanced-form';

class Checkbox extends React.Component {
  render() {
    return (<input { ...this.props.fieldProps } />);
  }
}

export default createField({
  valuePropName: 'checked'
})(Checkbox);
```

### `mapPropsToField`
```jsx
import React from 'react';
import { createField } from 'react-advanced-form';

class Checkbox extends React.Component {
  render() {
    return (<input { ...this.props.fieldProps } />);
  }
}

export default createField({
  valuePropName: 'checked',
  mapPropsToField: (props, context) => ({
    ...props,
    type: 'checkbox',
    initialValue: props.checked
  })
})(Checkbox);
```

> **Note:** `mapPropsToField` should return the *whole* props Object. Make sure to include `...props`.

### `enforceProps`
Use this option to return the props to override the native field's props when necessary.

```jsx
import React from 'react';
import { createField } from 'react-advanced-form';

class Checkbox extends React.Component {
  render() {
    return (<input { ...this.props.fieldProps } />);
  }
}

export default createField({
  valuePropName: 'checked',
  enforceProps: (props, contextProps) => ({
    checked: contextProps.get('checked')
  })
})(Checkbox);
```

## Custom event handlers
Wrapped fields inherit `onFocus`, `onChange` and `onBlur` native event handlers automatically.

In order to have a custom logic happening during those event handlers, provide them *after* the native props propagation and ensure to call native event handlers inside your custom handlers.

```jsx
import React from 'react';
import { createField } from 'react-advanced-form';

class MyCheckbox extends React.Component {
  handleChange = (event) => {
    const { value: nextValue } = event.currentTarget;

    /* Make sure to dispatch the native event handler */
    this.props.handleFieldChange({
      event,
      nextValue
    });
  }

  render() {
    return (
      <input
        { ...this.props.fieldProps }
        onChange={ this.handleChange } />
    );
  }
}

export default createField({
  enforceProps: () => ({
    type: 'checkbox'
  })
})(MyCheckbox);
```

## Recommendations
* Write stateless wrapped components.
* Wrap custom components in `createField`, not native fields.
* Use [`connectField()`](./connectField.md) for custom styling, and `createField()` for custom field logic.
