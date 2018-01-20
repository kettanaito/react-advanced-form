# `createField(options: CreateFieldOptions)`

## Overview
* [Specification](#specification)
* [Declaration](#declaration)
* [Options](#options)
* [Custom event handlers](#custom-event-handlers)
* [Recommendations](#recommendations)

## Specification
A high-order component which enhances the provided custom component (`WrappedComponent`) to behave as a native field. It is primarily designed for custom fields implementation and the integration of third-party components to work gracefully with React Advanced Form.

> **Note:** It is important to understand the field lifecycle and the concept of React Advanced Form before creating custom fields. This will significantly reduce the amount of questions when using `createField`.

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
| Option name | Type | Description |
| ------ | ---- | ----------- |
| [`valuePropName`](#valuepropname) | `string` | A custom prop name to be treated as an updatable value during the field event handlers. **Default:** `'value'`. |
| [`mapPropsToField`](#mappropstofield) | `(props: Object, context: Object) => Object` | A custom maping function which should return a props Object used as the initial props during the field registration. |s
| [`enforceProps`](#enforceprops) | `(props: Object, contextProps: Immutable.Map) => Object` | A function which should return a props Object to be enforced on the custom field. |

### `valuePropName`
A field may update a different prop rather than `value` during its `onChange` event handler (i.e. a checkbox updates `checked` prop). Provide the prop name referencing the property to update using this option.

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
A function which controls the props with which the Field is registered within the form.

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

> **Note:** `mapPropsToField` should return the *whole* props Object for the Field registration. Make sure to include `...props`.

### `enforceProps`
This option allows to provide an Object of props which will override the Field's registration record within the form.

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

## Inherited event handlers
Once a component is wrapped into `createField()`, it automatically inherits the event handlers listed below through its props.

* [`handleFieldFocus`](../callbacks/Field/onFocus.md)
* [`handleFieldChange`](../callbacks/Field/onChange.md)
* [`handleFieldBlur`](../callbacks/Field/onBlur.md)

You would never call those native event handlers directly unless providing a custom logic during the respective events. Read how to use those native methods following their links to the Field callbacks documentation.

In order to have a custom logic happening during those event handlers, provide the respective custom event handlers *after* the native props propagation, and ensure **to call native event handlers** inside your custom handlers.

## Custom event handlers

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
* Ensure `createField` wraps custom components, *not* native fields.
* Use [`connectField()`](./connectField.md) for custom styling, and `createField()` for the fields with custom functionality.
