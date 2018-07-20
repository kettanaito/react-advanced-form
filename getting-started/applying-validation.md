# Applying validation

## Introduction

When we have both [validation rules](validation-rules.md) and [messages](validation-messages.md) defined, we need to apply them to see the working result.

## Implementation

There are multiple ways to apply the validation to the forms in our application. Each of them may be suitable in different situations.

### Application-wide

We can use a `FormProvider` component to apply the validation rules and message application-wide. That imples that all the forms in our application will abide by the defined rules automatically.

We need to introduce a `FormProvider` on the root level of your application. This is the place where you may already have another providers \(i.e. Redux, Apollo\).

```jsx
// app/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { FormProvider } from 'react-advanced-form';
import validationRules from './validation-rules';
import validationMessages from 'validation-messages';

const renderApp = () => (
  <FormProvider rules={ validationRules } messages={ validationMessages }>
    <Root />
  </FormProvider>
);

ReactDOM.render(renderApp, document.getElementById('root'));
```

### Form-wide

We can also apply our validation schemas to a specific form component. This may be useful in case some validation rules/messages are different for a certain form.

```jsx
import React from 'react';
import { Form } from 'react-advanced-form';

const customRules = {
  extend: false, // when "true", merges custom and application rules together
  type: {
    password: ({ value }) => anotherValidator(value)
  }
};

const customMessages = {
  type: {
    password: {
      invalid: 'I am different than general invalid password message'
    }
  }
};

export default class ExampleForm extends React.Component {
  render() {
    return (
      <Form rules={ customRules } messages={ customMessages }>
        { /* ... */ }
      </Form>
    );
  }
}
```

