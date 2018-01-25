# `Field.Group`

## Specification

This component is designed to provide the data separation on a layout level. Particularly useful for the scenarios when UI representation of fields doesn't match the data structure expected by the remote end-point. Field grouping affects the way you reference the field within the `fields` Object available in various callbacks methods.

## Props

* `name: string` The name of the field group. All the fields wrapped in `Field.Group` will be available by the following reference path: `${groupName}.${field.name}`.

## Examples

### Basic

```jsx
import React from 'react';
import { Form, Field } from 'react-advanced-form';
import { Input } from 'react-advanced-form-addons';

export default function MyForm() {
    return (
        <Form action={ ... }>
            <Field.Group name="primaryInfo">
                <Input name="username" value="admin" />
                <Input name="firstName" value="John" />
            </Field.Group>

            <Input name="city" value="London" />
        </Form>
    );
}
```

This layout will result into the following `serialized` Object upon submit:

```js
{
    city: 'London',
    primaryInfo: {
        username: 'admin',
        firstName: 'John'
    }
}
```

> **Tip:** `Field.Group` allows you to have multiple fields with _the same name_ under one Form, as long as there are no same names within one group (root, or custom field groups).

### Split groups

One of the benefits of `Field.Group` is an ability to have multiple groups with the same name, which will group the elements under one property upon the serialization. This is particularly useful when UI was not, or cannot be designed according to the data structure expected by the remote end-point.

Consider this:

```jsx
import React from 'react';
import { Form, Field } from 'react-advanced-form';
import { Input } from 'react-advanced-form-addons';

export default function MyForm() {
    return (
        <Form action={ ... }>
            <Input name="email" value="admin@site.com" />

            <h3>Billing address</h3>
            <Field.Group name="billingAddress">
                <Input name="firstName" value="John" />
                <Input name="lastName" value="Maverick" />
            </Field.Group>

            <h3>Delivery address</h3>
            <Field.Group name="billingAddress">
                <Field.Input name="firstName" value="Kate" />
                <Field.Input name="lastName" value="Rosewood" />
            </Field.Group>

            <h3>Contact details</h3>
            <Field.Group name="billingAddress">
                <Input name="phoneNumber" value="123456789" />
            </Field.Group>
            <Field.Group name="deliverAddress">
                <Input name="address" value="Baker st." />
            </Field.Group>
        </Form>
    );
}
```

The layout above will serialize into the following Object:

```js
{
    email: 'admin@site.com',
    billingAddress: {
        firstName: 'John',
        lastName: 'Maverick',
        phoneNumber: '123456789'
    },
    deliveryAddress: {
        firstName: 'Kate',
        lastName: 'Rosewood',
        address: 'Baker st.'
    }
}
```

This way grouping your fields dictates how their data will be handled when it comes to submit, reducing extra composition logic.



