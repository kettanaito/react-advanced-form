# `FormProvider`

## Specification

A provider component used to supply the application-wide form settings to all the children forms.

You may think of it as a `<Provider>` from Redux, only for the forms. This way the forms in the application, regardless of the depth they are rendered in, follow the options passed to the `<FormProvider>` component, unless specified otherwise.

## Usage

Currently `FormProvider` is used to propagate the [Validation rules](../validation/validation-rules.md) and the corresponding [Validation messages](../validation/validation-messages.md) to the underlying forms.

* `rules: ValidationRules`
* `messages: ValidationMessages`

```jsx
import React from 'react';
import { FormProvider } from 'react-advanced-form';

const App = ({ children }) => (
    <FormProvider rules={ validationRules } messages={ validationMessages }>
        { children }
    </FormProvider>
);
```



