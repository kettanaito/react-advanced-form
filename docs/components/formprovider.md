# `FormProvider`

## Specification

A provider component which propagates the application-wide form settings to all nested children forms.

Imagine it as a `Provider` from Redux, only for the forms. This way the forms in your application, regardless of the depth they are rendered in, inherit the options passed to the `<FormProvider>` component.

## Props

| Prop name | Type | Description |
| --------- | ---- | ----------- |
| `rules` | [`[ValidationRules: Object]`](../validation/rules.md) | Validation rules declaration. |
| `messages` | [`[ValidationMessages: Object]`](../validation/messages.md) | Validation messages declaration. |

## Example

Render the `<FormProvider>` on the root-level of your application (alongside the other providers you may have):

```jsx
import React from 'react';
import { FormProvider } from 'react-advanced-form';

const App = ({ children }) => (
    <FormProvider rules={ validationRules } messages={ validationMessages }>
        { children }
    </FormProvider>
);
```



