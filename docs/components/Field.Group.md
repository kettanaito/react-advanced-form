# Field Group

## Purpose
`<Field.Group>` component is meant to provide data separation on a markup level to reduce extra logic to achieve the same on submit handlers.

It also allows to have multiple fields with *the same name* inside a single form. This may significantly simplify the markup, making it more maintainable and usable.

## Props
### `name: string`
A unique name of the field group.

## Example
**Markup:**
```jsx
<Form>
  <Field.Group name="billingAddress">
    <Field.Input name="firstName" value="John" />
  </Field.Group>

  <Field.Group name="deliveryAddress">
    <Field.Input name="firstName" value="Katheline" />
  </Field.Group>
</Form>
```

**Serialized fields:**
```
{
  billingAddress: {
    firstName: 'John'
  },
  deliveryAddress: {
    firstName: 'Katheline'
  }
}
```

## Restrictions
* It's not yet possible to use nested `<Field.Group>` elements. This may appear as a pull request in the future.