# Field Group

## Introduction
`<Field.Group>` component is meant to provide data separation on a markup level to reduce the logic on submit handlers.

It also allows to have multiple fields with *the same name* inside a single form. This may significantly simplify the markup, making it more maintainable and usable.

## Props
### `name: string`
A group name, which may *not* be unique.

Groups, unlike fields, may repeat, granting you explicit control over how your data will be organized upon serialization. See the example of [Chunked groups](#chunked-groups).

> **Note:** Field names inside the same group should still be unique.

## Examples
### Simple group
```jsx
<Form>
  <Field.Input name="inputOne" value="foo" />

  <Field.Group name="groupOne">
    <Field.Input name="inputOne" value="hey" />
  </Field.Group>
</Form>
```
Serialized fields:
```js
{
  inputOne: 'foo',
  groupOne: {
    inputOne: 'hey'
  }
}
```

### Chunked groups
Group is all about data separation on a markup level. Sometimes the position of the fields in the design is not the position of fields required by remote end-point. For that, keep in mind that you may wrap different collections of fields into the same group, regardless of their position in the markup.

Those groups chunked are presented properly during the serialization, resulting into a single composite Object.

```jsx
<Form>
  <Field.Input name="inputOne" value="foo" />

  <Field.Group name="groupOne">
    <Field.Input name="nestedInput" value="nested" />
  </Field.Group>

  <Field.Input name="inputTwo" value="hello" />

  <Field.Group name="groupOne">
    <Field.Input name="anotherNested" value="again" />
  </Field.Group>
</Form>
```

Serialized fileds:
```js
{
  inputOne: 'foo',
  inputTwo: 'hello',
  groupOne: {
    nestedInput: 'nested',
    anotherNested: 'again'
  }
}
```

### Multiple groups
```jsx
<Form>
  <Field.Group name="groupOne">
    <Field.Input name="inputOne" value="multiple" />
    <Field.Input name="inputTwo" value="groups" />
  </Field.Group>

  <Field.Group name="groupTwo">
    <Field.Input name="inputOne" value="made" />
    <Field.Input name="inputTwo" value="easy" />
  </Field.Group>
</Form>
```

Serialized fields:
```
{
  groupOne: {
    inputOne: 'multiple',
    inputTwo: 'groups'
  },
  groupTwo: {
    inputOne: 'made',
    inputTwo: 'easy'
  }
}
```

## Restrictions
* It's not yet possible to use nested `<Field.Group>` components. This may appear as a pull request in the future.