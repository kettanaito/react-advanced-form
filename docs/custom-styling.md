# Custom styling

## Introduction
From the very beginning, having an ability to easily style the form to suit your custom designs was one of the top priorities. Although there were multiple approaches to acheive this, we have chose the most optimal one in terms of freedom/obedience balance. We want you, end developer, to focus on styling your forms, and do as less as possible to connect your styled UI to the exposed form components.

## Getting started
Styling your custom fields takes just two steps to accomplish.

1. Create your custom field component:
```jsx
// MyInput.js
import { connectField, Field } from 'react-advanced-form';

/**
 * Declare a custom field around the native one.
 */
function MyInput(props) {
  const { invalid, error, ...fieldProps } = props;

  return (
    <div className="field-wrapper">
      <div className="field-control">
        <Field.Input {...fieldProps} /> {/* Render native Field */}
      </div>

      { invalid && (
        <div className="field-error">{ error }</div>
      ) }
    </div>
  );
}

/**
 * Connect your custom field to the Form.
 * This will allow you to access field's internal props like `valid`, `invalid`, `error`
 * and much more, to reflect the field's state in your layout.
 */
export default connectField(MyInput);
```

> **Note:** Make sure to pass all the essential props to the native `<Field.Input>` in order for it to function properly. We recommend using props destruction (`...fieldProps`) for that matter.

2. Include your custom field in the form:
```jsx
import { Form } from 'react-advanced-form';
import MyInput from '../MyInput';

export default function MyForm() {
  return (
    <Form>
      <MyInput name="username" required />
    </Form>
  );
}
```
That's it. By having your custom field component connected to the Form via `connectField()`, your form is ready to go with custom styles and behaviors on top of the native Field.

## Exposed props
After connecting your custom field component to the Form using `connectField()`, your component can access the following properties:

* `valid: boolean` - Tells you whether the field is valid (has expected value).
* `invalid: boolean` - Tells you whether the field is invalid (has unexpected value). **Note:** `invalid !== !valid`. Read more about this in the [Validation states](./validation-states.md).
* `error: string` - The error message in case of unsuccessful validation.
* `validating: boolean` - Tells you that the field is currently being validated.
* `validated: boolean` - Tells you that the field has been already validated.
* `focused: boolean` - Represents the focused state of the field.
* `disabled: boolean` - Represent the disabled state of the field.
* `value: mixed` - The current value of the field.
