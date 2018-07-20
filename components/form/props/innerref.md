# innerRef

## Specification

A getter function for the actual `form` HTML element rendered by the `Form` component.

## Example

```jsx
import React from 'react';
import { Form } from 'react-advanced-form';

export default class Example extends React.Component {
  componentDidMount() {
    this.formElement; // HTMLElement
  }

  render() {
    return (
      <Form innerRef={ element => this.formElement = element } />
    );
  }
}
```

See more information under the [Referencing](../../../architecture/referencing.md#inner-reference).

