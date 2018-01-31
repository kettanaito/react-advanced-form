# `FormProvider`

## Specification

A provider component which provides the application-wide form settings to all children forms.

You may think of it as a `<Provider>` from Redux, only for the forms. This way the forms in the application, regardless of the depth they are rendered in, follow the options passed to the `<FormProvider>` component.

## Props

| Prop name | Type | Description |
| --------- | ---- | ----------- |
| `rule` | [`ValidationRules`](../validation/rules.md) | Validation rules declaration. |
| `messages` | [`ValidationMessages`](../validation/messages.md) | Validation messages declaration. |

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



