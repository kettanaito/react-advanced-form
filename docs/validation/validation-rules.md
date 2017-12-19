# Validation rules

## Specification

```ts
type ValidationRules = {
    extend?: boolean,
    type: {
        [fieldType: string]: ValidatorFunction
    },
    name: {
        [fieldName: string]: ValidatorFunction
    }
}
```

> **Note:** By providing `extend: true`, the current rules will extend the application-wide rules applied by `FormProvider`, if any.

```ts
type ValidatorFunction = ({
    value: mixed, // (shorthand) the value of the current field
    fieldProps: Object, // props of the current field
    fields: Object, // map of all fields present in the same Form
    form: ReactComponent // reference to the Form itself
}) => boolean
```

The purpose of the validation function is to return a `boolean`, stating whether the field is valid.

## Priority

Validation rules are applied to the fields following a certain priority logic.

### Context priority

First of all, the rules provided into an individual `Form` component via `Form.props.rules` have higher priority than the application-wide rules provided by `FormProvider`. By default, Form-wide rules will **completely override** the application-wide rules.

To change the overriding behavior pass `extend: true` to the Form-specific rules Object. By doing so, React Advanced Form will try to deeply merge both rules declarations and use the merged instance during the validation.

## Type priority

There are two types of the validation - `type`-specific validation and `name`-specific validation. Both those types refer to the validating Field. Name-specific rules have higher priority over type-specific rules, however, those **do not** override each other.

When you have provided both `type` and `name` specific rules, the Field will be validated against both in a defined sequence \(first name rule, then type rule\). This way name-specific rules are the superset on top of the type-specific rules.

## Examples

### Basics

```js
// src/app/validation-rules.js
export default {
    type: {
        /* Allow only numbers for the field[type="tel"] */
        tel: ({ value }) => /^\d+$/.test(value)
    },
    name: {
        /* Consider "lastName" valid only when "firstName" is provided */
        lastName: ({ fields }) => fields.firstName && fields.firstName.value
    }
};
```

Once declared, the validation rules can be reused in `FormProvider` or passed to the individual `Form` component directly. There is an example below how to pass the rules to the `FormProvider`, to apply them application-wise:

```jsx
// src/app/index.js
import React from 'react';
import { } from 'react-advanced-form';
import validationRules from './validation-rules';

const App = ({ children }) => (
    <FormProvider rules={ validationRules }>
        { children }
    </FormProvider>
);
```

### Extending rules

Consider that we have already passed the `validationRules` to the `FormProvider`, as in the example above.

```js
// src/app/validation-rules-custom.js
export default {
    name: {
        /* Use custom format validation on top of field[type="tel"] rule */
        phoneNumber: ({ value }) => ensureFormat(value)
    }
};
```

```jsx
// src/app/components/MyForm.jsx
import React from 'react';
import { Form, Field } from 'react-advanced-form';
import customValidationRules from '../../validation-rules-custom';

export default function MyForm() {
    return (
        <Form rules={ customValidationRules }>
            <Field.Input name="phoneNumber" type="tel" />
        </Form>
    );
}
```

The `phoneNumber` field will be validated against `customValidationRules.name.phoneNumber` first, and then against `validationRules.type.tel`.

