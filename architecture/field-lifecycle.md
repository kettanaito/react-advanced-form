# Field lifecycle

## Introduction

The field lifecycle is a common term which describes the behavior of the field component from its mounting up to its unmounting within the `Form` component.

Mentioned lifecycle events are handled by React Advanced Form _automatically_. This section bears rather an informational character, since understanding how technology works allows you to use it the most efficient way.

## Lifecycle

1. [Registering](field-lifecycle.md#registering)
2. [Handling events](field-lifecycle.md#handling-events)
3. [Unregistering](field-lifecycle.md#unregistering)

## Registering

When the field is declared, it needs to register within the parental `Form` component. That is a way to notify the form that a new field needs to be set into its internal state.

### Purpose of registration

First of all, field records compose the internal state of the `Form`, which manages all interactions with the field, and is responsible for the Form's internal functionality \(like serialization, reset, and much more\). Form's state, which is a composite of multiple field records, is a single source of truth for the form.

On top of that, detached parent-children relation between the field and its form allows to render the fields wherever and whenever during the component's lifecycle. `Form` component expects fields just _to be_ rendered anywhere within its bounds, without the assumptions of when and where.

### Field record

Registration, or field record – is an Object of props which propagates to the `Form.state`. The record isn't always the direct mirror of field's props. Moreover, some fields often require to alter their registration record for proper field functioning.

### Changing field record

It is possible to affect the registraional record when creating your custom components, or integrating third-party solutions, using [`mapPropsToField`](../high-order-components/createfield/#mapPropsToField) option of the [`createField()`](../high-order-components/createfield/) high-order component:

```jsx
import React from 'react';
import { createField } from 'react-advanced-form';

class CustomField extends React.Component {}

export default createField({
  mapPropsToField: ({ props, fieldRecord, context }) => ({
    ...fieldRecord,
    customProp: composeByProp(props.someProp)
  })
})(CustomField);
```

`fieldRecord` Object passed as the [argument property](argument-properties.md) is mutable, and changing the latter directly affects the Object of props at the registration point. Read more about this and other options in the `createField()` section of the documentation.

## Handling events

Core part of the field lifecycle is the events handling. By default, the next events are handled by the form automatically:

* [`Field.props.onFocus`](../components/field/callbacks/onfocus.md)
* [`Field.props.onChange`](../components/field/callbacks/onchange.md)
* [`Field.props.onBlur`](../components/field/callbacks/onblur.md)

State updates are invoked and maintained internally within the `Form` component, and require no developer's interference.

### Event callbacks

Developer can react to the required event callbacks just as he would usually do:

```jsx
import React from 'react';
import { Form } from 'react-advanced-form';
import { Input } from 'react-advanced-form-addons';

export default class Example extends React.Component {
  handleFieldFocus = ({ event, fieldProps, fields, form }) => {}

  handleEmailChange = ({ event, nextValue, prevValue, fieldProps, fields, form }) => {}

  handleFieldBlur = ({ event, fieldProps, fields, form }) => {}

  render() {
    return (
      <Form>
        <Input
          name="email"
          onFocus={ this.handleEmailFocus }
          onChange={ this.handleEmailChange }
          onBlur={ this.handleFieldBlur }
          required />
      </Form>
    );
  }
}
```

Custom `handleFieldFocus`, `handleEmailChange` and `handleFieldBlur` handlers **do not** control the actual events, but _react_ to them.

> **Note:** React Advanced Form is actively using the [Object-as-argument](argument-properties.md) approach when providing the arguments to the callback methods.
>
> The function above can behave as callback functions in case of uncontrolled fields, or as handler functions responsible for the update of controlled fields, depending on the presence of the `value` prop on the field component.

### Custom event handlers

It is still completely possible to declare custom event handlers for the fields. That is particularly useful when any additional logic should be performed during such essential events like `onChange`.

Developer must provide the custom event handlers during the field's declaration, if he wants to achieve a custom behavior. Here is a simple example of how to do so:

```jsx
// src/components/Input.jsx
import React from 'react';
import { createField, fieldPresets } from 'react-advanced-form';

class Input extends React.Component {
  /**
   * Custom "onChange" handler.
   */
  handleChange = (event) => {
    const { value: nextValue } = event.target;

    // ...

    /* It is mandatory to dispatch the native RAF event handler */
    this.props.handleFieldChange({ event });
  }

  render() {
    const { fieldProps } = this.props;

    return (
      <input
        { ...fieldProps }
        onChange={ this.handleChange } />
    );
  }
}

export default createField(fieldPresets.input)(Input);
```

When overriding the essential event handler managed by the `Form` automatically, the one must always dispatch the respective native event handler available via props:

* `CustomField.props.handleFieldFocus({ event })`
* `CustomField.props.handleFieldChange({ event })`
* `CustomField.props.handleFieldBlur({ event })`

Passing the `event` as an argument is sufficient to trigger internal updates, reacting to the occurred event.

## Unregistering

Similar to [registration process](field-lifecycle.md#registering), when the field's component is unmounted, its record in the `Form.state` must be removed.

