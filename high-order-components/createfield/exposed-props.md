# Exposed props

> This topic is related to [`createField`](https://github.com/kettanaito/react-advanced-form/tree/75c444924d87ca8ff76bc096231173e42e717adc/docs/hoc/createField/basics.md) high-order component. Make sure to understand the context it is being described.

After your field component is wrapped in the `createField`, it is being exposed the props which reflect the field's internal state. Those props can be used to tailor custom logic and exquisite styling.

## Props list

| Prop name | Type | Description |
| --- | --- | --- |
| `fieldProps` | `Object` | Collection of props dedicated to the form element \("input", "select", etc.\) itself. |
| `fieldState` | `Object` | Mirror of the field's record \(state\). |

> `fieldProps` are compsed from the `fieldState` and are exposed separately to ease the process of props assignment to the form elements.

## Field state

A representation of the field's record has multiple properties reflecting its state at the moment. Below there is a full list of the properties available under `fieldState` object.

### General

| Property | Type | Description |
| --- | --- | --- |
| `required` | `boolean` | Indicates whether the field is required. |
| `disabled` | `boolean` | Indicates whether the field is disabled. |

### Validation

| Property | Type | Description |
| --- | --- | --- |
| `validating` | `boolean` | Indicates whether the field is being validated at the moment. |
| `valid` | `boolean` | Indicates whether the field has passed all the validations. |
| `invalid` | `boolean` | Indicates whether the field has not passed all the validations. |
| `errors` | `string[]` | Collection of validation errors relative to the fields at the given point of time. |
| `validated` | `boolean` | Indicates that the field has been validated, regardless of the validation type and status. |
| `validatedSync` | `boolean` | Indicates whether the field has been validated synchronously. |
| `validSync` | `boolean` | Indicates whether the field is valid relatively to its synchronous validation rules. |
| `validatedAsync` | `boolean` | Indicates whether the field has been validated asynchronously. |
| `validAsync` | `boolean` | Indicates whether the field is valid relatively to its asynchronous validation rules. |
| `skip` | `boolean` | Indicates whether the field should be skipped during any serialization process. Read more about [`Field.props.skip`](../../components/field/props/skip.md). |

## Example

Exposed props are automatically available in `this.props` of the component.

```jsx
import React from 'react';
import { createField } from 'react-advanced-form';

class CustomField extends React.Component {
  render() {
    const { fieldProps, fieldState } = this.props;
    const { valid, invalid, errors } = fieldState;

    return (<input { ...fieldProps } />);
  }
}

export default createField()(CustomField);
```

> **Note:** The value of `withImmutable` on [`<FormProvider>`](../../components/formprovider.md) doesn't affect `fieldProps` and `fieldState`. Those are always plain Objects.

