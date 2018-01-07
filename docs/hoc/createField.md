# `createField(options: CreateFieldOptions)`

## Specification
A high-order component enhancing the provided custom component (`WrappedComponent`) to behave as a native field.

## Use cases
* Custom field implementation
* Third-party form components intergration

## Declaration
```jsx
import React from 'react';
import { createField } from 'react-advanced-form';

function CustomComponent(props) {
  return (<MyComponent { ...props }>);
}

export default createField({ ... })(CustomComponent);
```

> **Note:** It's crucial to propagate the `CustomComponent.props` to the `MyComponent` in order for it to behave as the native field.

## Options

### Type definition 
It is possible to use custom options during the `createField` declaration to achieve the required logic of the wrapped field.
```tsx

type CreateFieldOptions = {
  valueProp?: string,
  mapPropsToField?: (props: Object, context: Object) => Object,
  enforceProps?: (props: Object, contextProps: Immutable.Map) => Object
}
```

### Explanation

#### `valueProp?: string`
**Default:** `'value'`

A custom prop name which should be treated as an updatable value prop during `Field.handleChange` and various other event handlers and callbacks.

**Usage example:**
```jsx
import React from 'react';
import { createField } from 'react-advanced-form';

function Checkbox(props) {
  return (<input { ...props } />);
}

export default createField({
  valueProp: 'checked'
})(Checkbox);
```

By providing the `valueProp` option to `createField`, an enhanced `Checkbox` component will update its `checked` prop during the workflow with the field.

> **Note:** Radio field has `valueProp: 'checked`', as this is its the updatable prop, while still having `value` property, representing the actual value of each radio input.

#### `mapPropsToField?: (props: Object, context: Object): Object`

| Argument | Description |
| ------------- | ----------- |
| `props` | A reference to `WrappedComponent.props`. |
| `context` | Context Object exposed to the field from the parent `Form`. |

**Default:** `props => props`

Explicitly returns the props Object to be used as the registrational props during the custom field's registration process.

**Usage example:**
```jsx
import React from 'react';
import { createField } from 'react-advanced-form';

export default createField({
  mapPropsToField: (props, context) => ({
    ...
  })
})();
```

#### `enforceProps?: (props, contextProps): Object`

| Argument | Description |
| ------------- | ----------- |
| `props` | A reference to `WrappedComponent.props`. |
| `contextProps` |  |

**Default:** `() => ({})`

Returns the props of the highest priority to pass to the custom `WrappedComponent` wrapped instance. Useful to override the props assigned by `createField`.
