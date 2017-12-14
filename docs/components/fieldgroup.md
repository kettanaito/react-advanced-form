# `Field.Group`

## Specification

This component is designed to provide the data separation on a layout level. Particularly useful for the scenarios when UI representation of fields doesn't match the data structure expected by the remote end-point. Field grouping affects the way you reference the field within the `fields` Object available in various callbacks methods.

## Props

* `name: string` The name of the field group. All the fields wrapped in `Field.Group` will be available by the following reference path: `${groupName}.${field.name}`.

## Examples

```jsx
<Form>
    <Field.Group name="primaryInfo">
        <Field.Input name="username" value="admin" />
        <Field.Input name="firstName" value="John" />
    </Field.Group>
    
    <Field.Input name="city" value="Prague" />
</Form>
```

This layout will result into the following `serialized` Object upon submit:

```js
{
    city: 'Prague',
    primaryInfo: {
        username: 'admin',
        firstName: 'John'
    }
}
```

> **Tip:** `Field.Group` allows you to have multiple fields with _the same name_ under one Form, as long as there are no same names within one group \(root, or custom field groups\).



