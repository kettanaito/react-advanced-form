# onFirstChange

## Specification

A callback function called when the form becomes dirty.

## Definition

```typescript
type OnFirstChange = ({
  event: Event, // Reference to the event triggered the change
  prevValue: any, // The previous value of the field
  nextValue: any, // The next value of the field
  fieldProps: Object|Map, // The props of the field which triggered the change
  fields: Object|Map, // The state of all fields within the form
  form: ReactComponent // The form component reference
}) => void
```

## Example

```jsx
import React from 'react';
import { Form } from 'react-advanced-form';

export default class Example extends React.Component {
  handleFirstChange = ({ event, prevValue, nextValue, fieldProps, fields, form }) => {
    console.log('Field `%s` made the form dirty.', fieldProps.name);
  }

  render() {
    return (
      <Form onFirstChange={ this.handleFirstChange }>
        { /* Fields here */ }
      </Form>
    )
  }
}
```

