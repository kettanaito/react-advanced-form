# Argument properties

## Introduction

Each callback function in React Advanced Form uses an "_Object as argument_" approach, meaning that it exposes an argument Object with the set of fixed properties. Take a look at the example:

```jsx
export default class Example extends React.Component {
  handleSubmit = ({ serialized, fields, form }) => {}

  render() {
    return (
      <Form action={ this.handleSubmit } />
    );
  }
}
```

Notice how the argument of `action` handler \(`this.handleSubmit`\) is passed like an Object:

```javascript
({ serialized, fields, form }) => {}
```

This is the way how all arguments are passed to the custom callback functions. Argument properties like `fields` and `form` are always present in whichever callback method is being handled. On top of that, additional \(or contextual\) argument properties are passed to the argument Object as well.

> **Note:** You may see argument Object properties including all the possible properties in the examples over here. That is done solely for demonstrational purposes, you _do not_ need to include all argument properties – only the ones you need at the moment.

## Benefits

Adopting this approach grants the following benefits:

* Optional inclusion of arguments without unnecessary arguments listing:

```javascript
// Common
function foo(a, b, c) {
  return c; // only "c" argument is needed
}

// Object-as-an-argument
function foo({ c }) {
  return c;
}
```

* Defined Object keys ensure the consistent namespaces throughout the whole implementation:

```javascript
// Common
function handleFieldFocus(e, some, field) {}

// Object-as-argument
function handleFieldFocus({ event, field }) {}
```

* Easier dynamic composition:

```javascript
// common
const dynamicArgs = [4, true];

function foo(...dynamicArgs) {}

// Object-as-argument
const dynamicArgs = {
  arg1: 4,
  arg2: true
};

function foo(dynamicArgs) {}
```

## Keynotes

* Names of argument properties is the same throughout all callback method handlers. If it's `fields` it's `fields` everywhere.
* Names of argument properties is designed to be intuitive and clear. Please create a pull request if you find obscure variable names.

