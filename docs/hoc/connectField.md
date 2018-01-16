# `connectField(WrappedComponent: React.Component)`

## Specification
A high-order component which enhances the provided `WrappedComponent`, making it an intermediate layer accepting and propagating the changes of the native `Field` rendered by it.

## Usage scenarios
* Custom layout and styling of the fields

## Declaration
```jsx
import React from 'react';
import { connectField, Field } from 'react-advanced-form';

class MyComponent extends React.Component {
  render() {
    return (
      <Field.Input { ...this.props } />
    );
  }
}

export default connectField(MyComponent);
```

## Propagates props
There is a list of props propagated to the `WrappedComponent` which are primarily useful for the styling logic.

### General props
| Prop name | Type | Description |
| --------- | ---- | ----------- |
| `focused` | `boolean` | Represents the focused state of the field. |
| `disabled` | `boolean` | Represents the disabled state of the field. |

### Validation props
| Prop name | Type | Description |
| --------- | ---- | ----------- |
| `validating` | `boolean` | `true` when the field is currently under the validation process. |
| `validSync` | `boolean` | Represents whether the field passed the sync validation. |
| `validAsync` | `boolean` | Represents whether the field passed the async validation. |
| `valid` | `boolean` | Represents whether the field passed all layers of the validation. |
| `invalid` | `boolean` | Represents whether the field hasn't passed the validation. |
| `error` | `string` | An error message received from the form's error messages list at the current state of the validation. |

## Example
To illustrate, let's style a simple `Field.Input` component according to the Bootstrap's field layout.

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import { connectField, Field } from 'react-advanced-form';

class Input extends React.Component {
  static propTypes = {
    label: PropTypes.string
  }

  render() {
    const { label, invalid, error } = this.props;

    return (
      <div className="form-group">
        { /* Label */ }
        { label && (
          <div>{ label }</div>
        ) }

        { /* Native RAF field */ }
        <Field.Input
          className="form-control"
          { ...this.props } />

        { /* Error */ }
        { invalid && (
          <div className="invalid-feedback">{ error }</div>
        ) }
      </div>
    );
  }
}

export default connectField(Input);
```

## Recommendations
* Write stateless components for styled fields.
* Always return one of the native fields (i.e. `Field.Input` or `Field.Checkbox`).
* Use `connectField()` for styling purposes only. For custom field logic consider [`createField()`](./createField.md).
