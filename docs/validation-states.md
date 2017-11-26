# Validation states

## Introduction
The roots of this issue lead us back to the original project which has started this repository. The one cannot say that the requirements there were extraordinary, yet inability to forsee them in advance led to rather obscure decisions. We tried to refine the latter, making a form which would work gracefully in real-world reqiurements.

## TL;DR
> Speaking of interfaces, when field is valid, it doesn't mean that it's not invalid, and vice versa. You're welcome for blowing your mind just now.

For those who seek more detailed explanation on the issue, keep reading.

## The issue
As counterintuitive as it may sound, `valid !== !invalid` and `invalid !== !valid`. The more your understand the reason behind it, the more you would agree with this statement.

To explain this, consider the next scenario:
```jsx
<Field.Input name="username" required />
```
This is a required field. We can paraphrase, saying that once this field is not provided a value, form submit should not happen. Users are often met with the corresponding UI messages to notify that the crucial data is missing.

Below there is an example how you may be expecting the UI to behave in case of different states of validity:
```jsx
const { valid } = fieldProps;

return (
  <div>
    <Field.Input name="username" required />
    { valid ? <Tick /> : <Cross /> }
  </div>
);
```
This would render a green tick once the field is valid, and a fearsome red cross when it's not. While this looks logical, you would soon realize this is not the way to go. The reason has to do with the initial value of `valid`.

Since booleans can possess either `true` or `false`, one of our validation icons will *always* render. Even when we set `valid` to `undefined` or `null`, it will still be treated as `false`, since those are falsy values. Now imagine the user opens your shiny form and is immediately attacked by dozens of red crosses or green ticks, while he did literally nothing to expect the form's reaction.

It doesn't matter if you add `value` state to this logic. You simply cannot rely on `valid` alone to render a stable field interface.

### Handle validity states
The props of the field should be clear for intuitive styling. Taking into consideration all the previous findings, we have decided to make a few fundamental changes to have validity of the field is described.

* `expected` tells you that the value of the field is expected. Means, the value entered is the value you were expecting based on the validation rules.
* `validated` means that the field has been already validated.
* `invalid` means that the field is invalid, obviously.

The main changes here are that the `valid` and `invalid` props are not responsible *solely* for interface purposes. In order for form submit to depend on the valid required fields, we have introduces the `expected` property. The last but not least, `validated` let us an opportunity to react to the user's interactions with the field only when this is really needed.

In the end, all this to ensure simple and proper validity states:
```js
const valid = !!value && validated && expected;
const invalid = validated && !expected;
```
For the field to be considered `valid`, it must have a value, be validated and its value should be the one expected. As you may have noticed, writing `const invalid = !valid` would not work as expected. That is because the validation itself should be reflect in the UI *only* once the field underwent it. Therefore, both `valid` and `invalid` rely on `validated` state.

Separation of validation states reusing those props allow us to write clean and what's more important - properly reacting interfaces:
```jsx
const { valid, invalid } = fieldProps;

return (
  <div>
    <Field.Input name="username" required />
    { valid && (<Tick />) }
    { invalid && (<Cross />) }
  </div>
);
```
Note that `valid` and `invalid` both can be `false` at the same time. Moreover, this is just what you need for the interface to work in case of initial render of the field. However, they cannot be `true` at the same time.