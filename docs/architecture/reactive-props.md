# Reactive props

> This is a highly experimental technology and it may be changed, or  removed in the future releases.

* [Specification](#specification)
* [Declaration](#declaration)
* [Delegated subscription](#delegated-subscription)

## Specification
*Reactive prop* - is a field's prop, which value is resolved automatically using the live subscriptions system. The latter allows to subscribe to the specific props changes of the fields referenced within the reactive prop resolver function, and re-resolve it anytime the props change.

> **Note:** Right now only `required` prop can be used as a reactive prop.

## Declaration
Whenever another field's prop is referenced using the exposed `fields` argument property, a live subscription for that referenced prop is created.

```jsx
<Input
  name="fieldOne"
  initialValue="foo" />
<Input
  name="fieldTwo"
  required={({ fields }) => {
    return !!fields.fieldOne.value;
  }} />
```

Notice how `fieldTwo.required` equals a function which references the `fieldOne` field, and its `value` prop. Because of that, the `required` prop becomes reactive, re-updating each time `fieldOne.valuve` changes.

Reactive prop resolver is kept in the dedicated key of the [Field record](./field-lifecycle.md#field-record), while the reactive prop's value always equals the result of the executed resolver. For example, the value of `fieldTwo.required` would equal to `true` at the initial mount, since the resolver function returns `true`.

> **Note:** It is possible to reference any props present in the [Field's state](../hoc/createField/props.md#field-state), which include `value`, `valid`, `validSync`, and many more.

### Safe key path reference
React Advanced Form uses a recursive Objecy proxy to analyze the referenced fields, therefore, it's **not needed** to ensure the safe key path reference, even if referencing deep non-existing keys. The latter are automatically ensafed, allowing you to write clear fields references.

That being said, the following key path reference **will not throw**:
```js
fields.nonExistingGroup.nonExistingField.propName;
```

### Multiple fields references
It is perfectly fine to reference multiple fields within the reactive prop's resolver function:

```jsx
<Checkbox
  name="termsAndConditions"
  required={({ fields }) => {
    const hasFirstName = fields.firstName.valid;
    const hasLastName = fields.lastName.valid;
    return hasFirstName && hasLastName;
  }} />
```

## Delegated subscription
Reactive prop resolver can also reference the fields which haven't mounted yet at the moment of its declaration. In that case a direct subscription cannot be created.

Nevertheless, React Advanced Form knows which fields have been referenced, regardless of the mounting status of the latter. In case the referenced field is not mounted, a *delegated subscription* is created.

Delegated subscription behaves the following way:

1. Listens to the event when the referenced field becomes registered.
1. Analyzes the resolver function once more, gathering the references props of the newly registered referenced field.
1. Creates a subscription for the changes of the referenced props list.
1. Removes the delegated subscription.

To illustrate this, consider the next scenario:

```jsx
<Input
  name="fieldOne"
  initialValue="foo" />

<Input
  name="fieldTwo"
  required={({ fields }) => {
    const fieldOneFilled = !!fields.fieldOne.value;
    const fieldThreeFilled = !!fields.fieldThree.value;

    return fieldOneFilled && fieldThreeFilled;
  }} />

<Input
  name="fieldThree"
  initialValue="doe" />
```

`fieldTwo` has the reactive prop `required`, which depends on `fieldOne.value` and `fieldThree.value`. By the time the resolver is created, `fieldThree` is not mounted in the form. For that the delegated subscription is created, awaiting for the `fieldThree` to register (which, essentially, means to mount). Once the referenced fiels has been mounted, the value of `fieldTwo.required` is re-resolved into `true`, since both referenced fields have their values set.
