# Options

> This topic is related to [`createField`](./basics.md) high-order component. Make sure to understand the context it is being described.

| Option name | Type | Description |
| ------ | ---- | ----------- |
| [`valuePropName`](#valuepropname) | `string` | A custom prop name to be treated as an updatable value during the field event handlers. |
| [`mapPropsToField`](#mappropstofield) | `({ props, context, fieldRecord, valuePropName }) => Object` | A custom maping function which should return a props Object used as the initial props during the field registration. |s
| [`enforceProps`](#enforceprops) | `({ props, contextProps }) => Object` | A function which should return a props Object to be enforced on the custom field. |

## `valuePropName: string`
**Default:** `value`

Some fields update a prop different from the `value` upon the interaction with them. For example, a checkbox updates its `checked` prop. Provide the prop name to update on field's `onChange` using this option, in case it differs from `value`.

```jsx
import React from 'react';
import { createField } from 'react-advanced-form';

class Checkbox extends React.Component {
  render() {
    const { fieldProps } = this.props;

    return (<input { ...fieldProps } />);
  }
}

export default createField({
  valuePropName: 'checked'
})(Checkbox);
```

## `mapPropsToField: ({ props, context, fieldRecord, valuePropName }) => Object`

Each field has its record stored in the internal state of the `Form` component. That record is composed based on the field's props, but may (and sometimes must) be altered to provide proper field functionality.

To change the initial values of the field record pass this option to the `createField` as follows:

```jsx
import React from 'react';
import { createField } from 'react-advanced-form';

class Checkbox extends React.Component {
  render() {
    const { fieldProps } = this.props;

    return (<input { ...fieldProps } />);
  }
}

export default createField({
  valuePropName: 'checked',
  mapPropsToField: ({ props, fieldRecord, valuePropName }) => ({
    ...props,
    type: 'checkbox',
    initialValue: props.checked
  })
})(Checkbox);
```

## `enforceProps: ({ props, contextProps }) => Object`
This option allows to provide an Object of props which will override the Field's registration record within the form.

```jsx
import React from 'react';
import { createField } from 'react-advanced-form';

class Checkbox extends React.Component {
  render() {
    const { fieldProps } = this.props;

    return (<input { ...fieldProps } />);
  }
}

export default createField({
  valuePropName: 'checked',
  enforceProps: (props, contextProps) => ({
    checked: contextProps.get('checked')
  })
})(Checkbox);
```