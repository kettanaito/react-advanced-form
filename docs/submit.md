## Form submit
React advanced form provides a flexible way of handling form submit, for both business logic and UI purposes.

## Submit action
### `action: ({ fields, serialized, formProps }) => Promise`

Each of the forms you use will most likely need an `action` prop to be provided. That is a function which returns a Promise, which will work good with any kind of async requests, or Redux actions (yes, you can return Redux actions and it *just* works).

### Usage with Redux
Here's a simple example of registration form with Redux responsible for handling the registration request.
```jsx
import React from 'react';
import { connect } from 'react-redux';
import { Form, Field } from 'react-advanced-form';
import { registerUser } from '../your/redux/actions';

class Registration extends React.Component {
  handleSubmit = ({ fields, serialized, formProps }) => {
    return this.props.registerUser(serialized);
  }

  render() {
    return (
      <Form action={ this.handleSubmit }>
        <Field.Input name="username" required />
        <button type="submit">Register</button>
      </Form>
    );
  }
}

export default connect(null, { registerUser })(Registration);
```
That *is* a fully working example. Field validation is handled behind the scenes according to the rules you specify, so you need not to worry about your `this.handleSubmit` called at a wrong time. Read more about the flexible [Validation logic](./validation.md) and how to efficiently provide [validation messages and rules](./validation.md#usage-examples) in the respective documentation.

> **Note:** For Redux actions to be able to return a Promise you may want to consider [redux-thunk](https://github.com/gaearon/redux-thunk), [redux-saga](https://github.com/redux-saga/redux-saga), or any other middleware which allows you do so.

## Callback methods
### `onSubmitStart: ({ fields, serialized, formProps }) => void`
### `onSubmitted: ({ fields, serialized, formProps, res }) => void`
### `onSubmitFailed: ({ fields, serialized, formProps, res }) => void`
### `onSubmitEnd: ({ fields, serialized, formProps, res }) => void`

Handling submit in the user interfaces is no longer a feature, but a must in the modern web development. Most likely, you've been doing this somehow like this (**this is NOT how you do it with react-advanced-form**):

```jsx
export default class MyForm extends React.Component {
  state = {
    isSubmitting: false // keep the flag in state
  }

  handleSubmit = () => {
    this.setState({ isSubmitting: true });

    asyncReq(...)
      .then(() => { ... })
      .catch(() => { ... })
      .then(() => this.setState({ isSubmitting: false })); // update the state at the proper time
  }

  render() {
    const { isSubmitting } = this.state;

    return isSubmitting ? (<Loader />) : (...);
  }
}
```
Just for the sake of handling a simple loading in the interface, you have made your component stateless and should maintain the logic of setting `isSubmitting` manually. No more.

### Handle submit status
There are multiple properties exposed through `Form` to make sure you handle the submit status without much effort.

```jsx
export default class MyForm extends React.Component {
  handleSubmitStart = ({ fields, serialized, formProps }) => {
    // Submit started
  }

  handleSubmitted = ({ fields, serialized, formProps, res }) => {
    // Do anything, knowing that for submitted successfully!
  }

  handleSubmitFailed = ({ fields, serialized, formProps, res }) => {
    // Submit failed
  }

  handleSubmitEnd = ({ fields, serialized, formProps, res }) => {
    // Submit ended
  }

  render() {
    return (
      <Form
        action={ ... }
        onSubmitStart={ this.handleSubmitStart }
        onSubmited={ this.handleSubmitted }
        onSubmitFailed={ this.handleSubmitFailed }
        onSubmitEnd={ this.handleSubmitEnd }>
        ...
      </Form>
    );
  }
}
```
Those props are called based on the resolving of the provided `action`. Here's a detailed explanation when each of those callbacks are executed:

| Callback | Description |
| ---- | ----------- |
| `onSubmitStart` | Invoked immediately once the form is valid and submit has begun. |
| `onSubmitted` | Invoked *only* when the form has been submitted successfully. |
| `onSubmitFailed` | Invoked *only* when submit failed. |
| `onSubmitEnd` | invoked *always* after submit status is known (submitted/failed), but regardless of the latter. |

Apart from those being integrated with the `action`, each of the callbacks can access a list of arguments useful for handling any logic you need:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `fields` | `Object` | Props of all fields within the current form. |
| `serialized`| `Object` | Serialized fields data. |
| `formProps` | `Object` | Self-explanatory. |
| `res` | `mixed` | A payload of each Promise steps (resolve/reject/other). |

### Handling `res` property
A `res` property accessible as an argument of `onSubmitted`, `onSubmitFailed` and `onSubmitEnd` is a variable passed through each of the Promise processing chain. Perhaps, this is the easiest way to explain it:

```js
action(...) // that is "Form.props.action"
  .then(res => onSubmitted({ ..., res }))
  .catch(res => onSubmitFailed({ ..., res }))
  .then(res => onSubmitEnd({ ..., res }));
```

This property allows you to access various response data received in different submit scenario. In other words, this is a payload from the `action` request call.

## Manual submit
A form may be submitted manually by calling `Form.submit()` method directly, using the form's reference:

```jsx
export default class ManualSubmitForm extends React.Component {
  handleManualSubmit = () => {
    this.myForm.submit(); // submits the form manually
  }

  render() {
    return (
      <Form ref={ form => this.myForm = form }>...</Form>
    );
  }
}
```

This will fire the [Callback methods](#callback-methods) according to the `action` status, just as it would when doing a native submit.

## Custom submit
In case you need to perform transformations of the form data bypassing the submit itself, you need to call `Form.serialize()` to get the serialized fields' values. Read more on that in [Manual serialization](./serialization.md#manual-serialization).

Handling the form data this way will **not** invoke any of [Callback methods](#callback-methods), since there is no actual submit happening.
