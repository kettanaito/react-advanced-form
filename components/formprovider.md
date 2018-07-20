# FormProvider

## Specification

A provider component which propagates the application-wide form settings to all children forms.

Think of it as of a `Provider` from Redux, only for the forms. This way the forms in your application, regardless of the depth they are rendered in, inherit the options passed to the `<FormProvider>` component.

## Props

| Prop name | Type | Default value | Description |
| --- | --- | --- | --- |
| `rules` | [`[ValidationRules: Object]`](../validation/rules.md) | `null` | Validation rules declaration. |
| `messages` | [`[ValidationMessages: Object]`](../validation/messages.md) | `null` | Validation messages declaration. |
| `withImmutable` | `boolean` | `false` | When `true`, all argument properties \(i.e. `fieldProps`, `fields`\) are going to be instances of Immutable. Always provide this property if you are familiar and using Immutable in your project. |
| `debounceTime` | `number` | `250` | Custom debounce duration \(ms\) for onChange field validation. |

## Example

### Rules and messages

Render the `<FormProvider>` on the root-level of your application \(alongside the other providers you may have\):

```jsx
import React from 'react';
import { FormProvider } from 'react-advanced-form';

const App = ({ children }) => (
  <FormProvider rules={ validationRules } messages={ validationMessages }>
    { children }
  </FormProvider>
);
```

### Immutable argument properties

```jsx
import React from 'react';
import { FormProvider } from 'react-advanced-form';
import { Input } from 'react-advanced-form-addons';

export default class Example extends React.Component {
  handleUsernameChange = ({ fieldProps, fields }) => {
    fieldProps.get('value');
    fields.get('anotherField');
  }

  render() {
    return (
      <FormProvider withImmutable>
        <Form>
          <Input
            name="username"
            onChange={ this.handleUsernameChange } />
        </Form>
      </FormProvider>
    );
  }
}
`
```

