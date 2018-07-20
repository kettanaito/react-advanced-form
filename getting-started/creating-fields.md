# Creating fields

> Code examples in the documentation refer to the `react-advanced-form-addons` prototyping library for the illustrational purposes only. You are recommended to always define your own set of fields that suit your project's needs foremost.

## Introduction

Form must never assume the appearance of the fields. Instead, it should provide all the essential tools and data to craft whichever UI is necessary.

Integration of React Advanced Form in your application begins with creating a set of reusable field components. The latter are then being used to compose any form possible.

## Implementation

To declare a field you need to create a React component and wrap it in the `createField` high-order component. By doing so, the field can automatically access such information as its validation status, error messages, and much more \(see the full list of [Exposed props](../high-order-components/createfield/exposed-props.md)\).

Fields will often require to use additional [Field presets](../high-order-components/createfield/presets.md) as the argument to the high-order component. Those presets automatically remap essential form elements' props relevant to the field type, and ensure the proper functionality of the fields.

Read the documentation on how to use [`createField`](https://github.com/kettanaito/react-advanced-form/tree/75c444924d87ca8ff76bc096231173e42e717adc/docs/hoc/createField/basics.md), and see the [Examples](creating-fields.md#examples) below for a more practical overview.

## Examples

Look into the set of common fields used internally for unit and integrational tests of React Advanced Form. For demonstrational purposes, a [Bootstrap 4](https://v4-alpha.getbootstrap.com/components/forms) form layout is being used. However, the layout and appearance of the fields is completely in your hands.

### Common

> A good place to get to know a field declaration. These are the implementations of common field components, the ones you would most likely have in your application.

* [Input](https://github.com/kettanaito/react-advanced-form/tree/master/examples/fields/Input.jsx)
* [Radio](https://github.com/kettanaito/react-advanced-form/tree/master/examples/fields/Radio.jsx)
* [Checkbox](https://github.com/kettanaito/react-advanced-form/tree/master/examples/fields/Checkbox.jsx)
* [Select](https://github.com/kettanaito/react-advanced-form/tree/master/examples/fields/Select.jsx)
* [Textarea](https://github.com/kettanaito/react-advanced-form/tree/master/examples/fields/Textarea.jsx)

### Third-party

> Examples that demonstrate the integration of third-party libraries to field components. See those for some advanced use cases.

* [Datepicker](https://github.com/kettanaito/react-advanced-form/blob/master/examples/third-party/react-datepicker/Datepicker.jsx)
* [Select](https://github.com/kettanaito/react-advanced-form/blob/master/examples/third-party/react-select/Select.jsx)
* [Slider](https://github.com/kettanaito/react-advanced-form/blob/master/examples/third-party/react-slider/Slider.jsx)

