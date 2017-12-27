# Custom styling

## Introduction

Styling a form should be an easy and pleasant experience, allowing you to achieve modern look _and_ modern functionality without the two conflicting with each other. The main concept behind the custom styling is to completely separate the logic of the `Field` component and its visual appearance, fully dedicating the latter to the end developer.

Technically speaking, this is achieved by the `connectField` component, a HOC which wraps a custom React component (custom field), providing the following features:

* Subscribes the custom component to the native `Field` lifecycle events
* Propagates all the essential props of the field to the custom component to tailor the best user interface possible
* Strives towards the custom components being stateless/functional

## Usage

```jsx
import React from 'react';
import { SpinnerIcon, TickIcon, CrossIcon } from 'whichever-icons';
import { connectField, Field } from 'react-advanced-form';

function MyInput(props) {
    const { valid, invalid, validating } = props;

    return (
        <div className="form-control">
            <Field.Input {...props} />

            { validating && (<SpinnerIcon />) } // show spinning icon when the field undergoes validation
            { valid && (<TickIcon />) } // show success icon when the field is valid
            { invalid && (<CrossIcon />) } // show failure icon when the field is invalid
        </div>
    );
}

export default connectField(MyInput);
```

> **Note:** A key point for the native `Field.Input` to function properly is to ensure you pass all the props from your custom field to it \(`{...props}` - as written in the example above\).

By wrapping your custom field with `connectField` you are subscribing your component to the corresponding entry in the `Form` responsible for handling the field's props. The props of the `Field.Input` rendered in the example above are propagated to `MyInput` and are available there in the `props` directly.

## Props

There is a full list of props available for your custom fields once wrapped in `connectField`:

* `focused: boolean` - Represents the focused state of the field.
* `disabled: boolean` - Represents the disabled state of the field.
* `validating: boolean` - `true` when the field is currently under the validation process.
* `validSync: boolean` - Represents whether the field passed the sync validation.
* `validAsync: boolean` - Represents whether the field passed the async validation.
* `valid: boolean` - Represents whether the field passed all levels of validation.
* `invalid` - Represents whether the field doesn't pass the validation.



