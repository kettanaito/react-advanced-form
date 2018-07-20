# Reactive props

* [Specification](reactive-props.md#specification)
* [Reactive field props](reactive-props.md#reactive-field-props)
* [Reactive validation rules](reactive-props.md#reactive-validation-rules)

## Specification

> This is a highly experimental technology and it may change, or be removed in the future. Follow the release notes for more information.

_Reactive prop_ - is a field's prop, which value is resolved automatically using the live subscriptions system. The latter allows to subscribe to props changes of another fields, and re-evaluate the reactive prop's resolver whenever the referenced props update.

This is a generic concept implemented in several features of React Advanced Form. Those are listed below in this section. Each feature may utilize this concept in a different way, although the interface strives to be unified.

## Behavior

Below, there is a list of behaviors applicable to reactive props, regardless of where they are used. For consistency's sake, [Reactive field props](reactive-props.md#reactive-field-props) interface is used in these examples.

### Safe key reference

There is no need to explicitly check for the field's existence in order to reference props of potentially non-existent fields. The interface of reactive props provides safe key reference using Immutable instances.

For example, this is the _**wrong**_ way of declaring a prop subscription:

```jsx
<Checkbox
  required={({ get, fields }) => {
    // the WRONG way of reactive prop declaration
    const foo = get(['fieldOne']) && get(['fieldOne', 'value']);
    const bar = fields.fieldTwo && get(['fieldTwo', 'value']);
    return foo && bar;
  }} />
```

The _**correct**_ way would be much more clean and simple:

```jsx
<Checkbox
  required={({ get }) => {
    /* "get" checks if "fieldOne" exists automatically */
    const foo = get(['fieldOne', 'value']);
    const bar = get(['fieldTwo', 'required']);

    return foo && bar;
  }}>
```

In case the referenced field, or its prop, doesn't exist, the getter will return `undefined`.

### Multiple field references

It is possible to reference multiple fields within a single reactive prop resolver function:

```jsx
<Checkbox
  name="termsAndConditions"
  required={({ get }) => {
    const foo = get(['firstName', 'valid']);
    const bar = get(['lastName', 'required']);

    return foo && !bar;
  }} />
```

This will create two observers, respectively, and each change of the referenced props will trigger re-evaluataion of that `required` resolver function.

### Delegated subscription

Reactive prop resolver can also reference fields which haven't mounted yet at the moment when the resolver function is declared. In that case a direct subscription cannot be created. Instead, a _delegated_ subscription is created.

The purpose of the delegated subscription is to listen for the field registration event and re-evaluate the resolver function after the mounting occurs.

Delegated subscription behaves the following way:

1. Listens to the event when the referenced field becomes registered.
2. Analyzes the resolver function once more, gathering the references props of the newly registered referenced field.
3. Creates a subscription for the changes of the referenced props list.
4. Removes the delegated subscription.

To illustrate this, consider the next scenario:

```jsx
<Input
  name="fieldTwo"
  required={({ get }) => !!get(['fieldThree', 'value'])} />
<Input
  name="fieldThree"
  initialValue="doe" />
```

By the time `fielTwo.props.required` reactive prop is evaluated, the referenced `fieldThree` doesn't exist yet. Once the referenced field has been mounted, the resolver function \(`fieldTwo.props.required`\) is re-evaluated, and the value of `required` prop is updated according to the resolver logic \(to `true` in the example above\).

## Reactive field props

To create a reactive field prop simply pass a function as its value, and use the exposed `get` method to reference props of another fields.

> **Note:** At the moment reactive field props are supported only for the `required` prop.

### Syntax

```jsx
<FieldComponent
  required={({ get }) => {
    return get(['path', 'to', 'field"s', 'prop']);
  }} />
```

### Usage

Whenever another field's prop is referenced using the `get` method, a live subscription for that referenced prop is created.

```jsx
<Input
  name="fieldOne"
  initialValue="foo" />
<Input
  name="fieldTwo"
  required={({ get }) => !!get(['fieldOne', 'value'])} />
```

Reactive props resolver is never assigned as a value of the reactive prop. Instead, it is copied and executed whenever the referenced prop updates, consequentially updating the prop, which is connected to the resolver.

> **Note:** It is possible to reference any props from the [Field's state](../high-order-components/createfield/exposed-props.md#field-state) \(i.e. `value`, `valid`, `validSync`, and many more\).

## Reactive validation rules

The concept of reactive props is applicable to synchronous validation rules as well. Just as with the [Reactive field props](reactive-props.md#reactive-field-props), whenever another field's prop is referenced within a synchronous validation rule declaration, the latter is re-evaluated each time the referenced prop updates.

### Syntax

```javascript
export default {
  name: {
    confirmPassword: ({ value, get }) => {
      /**
       * This reads as:
       * The "confirmPassword" field is valid only when its value
       * equals to "userPassword" field "value" prop.
       */
      return value === get(['userPassword', 'value']);
    }
  }
};
```

> The syntax for type-specific validation rules is identical.

