# Creating fields

> Code examples in the documentation feature `react-advanced-form-addons` prototyping library for the illustrational purposes only. You will always define your own set of fields, which suits your project's requirements.

## Introduction
Form should never assume the appearance of the fields. Instead, it should provide the developer all the necessary tools and data to craft whichever UI is required.

Integration of React Advanced Form in your application starts with creating a set of reusable field components. Those are the composites for any form on your website.

## Implementation
To declare a field you need to create a React component and wrap it in the `createField` high-order component. By doing so, the field can automatically access such information as its validation status, error messages, and much more (see the full list of [Exposed props](../hoc/createField/props.md)).

Some field types (i.e. "radio" or "checkbox") will require to pass additional [Field presets](../hoc/createField/presets.md) as the argument to the high-order component.

Read the documentation on how to use [`createField`](../hoc/createField/basics.md), and see the [Examples](#examples) below for a more practical overview.

## Examples
Look into the set of common fields used internally for unit and integrational tests of React Advanced Form. For demonstrational purposes, a [Bootstrap 4](https://v4-alpha.getbootstrap.com/components/forms) form layout is being used. However, the layout and appearance of the fields is completely in your hands.

* Input
* Radio
* Checkbox
* Select
* Textarea
