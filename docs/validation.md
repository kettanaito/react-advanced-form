# Form validation
* [Logic and specificity](#logic-and-specificity)
* [Rules declaration](#rules-declaration)
* [Usage examples](#usage-examples)

## Introduction
Being able to efficiently validate the form the way you need, when you need it - is an essential requirement toward any form. We have analyzed and refined dozens of usage scenarios to come up with the predictable, flexible and reliable validation algorithm.

## Logic and specificity
Below are listed the validation steps in the order of their execution.

1. First, ensure that entered value has the expected format. This is a set of synchronous front-end validation rules executed in the exact sequence:
  1. [Field rules](#field-rules) (`Field.props.rule`) have the highest priority.
  2. Custom [Form rules](#form-rules) (`Form.props.rules`) are similar to field rules, but applied form-wide.
  3. [FormProvider rules]() have the lowest priority and are applied application-wise.
2. Once the value is expected, it undergoes an asynchronous validation using [Asynchronous Field rules](#asynchronous-field-rules) (`Field.props.asyncRule`).

> **Note:** All validation steps are optional for you to specify, however, once provided, *all* should resolve in order for a field to be considered valid.

## Rules declaration
There is a certain way to declare validation rules for your forms. Make sure you follow these recommendations to achieve a gracefully working forms.

### Field rules
#### `rule?: RegExp | ({ value, fieldProps, fields, formProps }) => boolean`
Each field can have its own synchronous (front-end) validation specified using `rule` prop:
```jsx
<Field.Input name="username" rule={/^\w+$/} />
```
> **Note:** The way field validation behaves depends on its `required` prop.

Keeping this in mind, the example above reads that the field will be validated *only* when it has value. Since it's not a required field, empty value is also a valid option.

At the same time, the following example will validate field as `missing` when it doesn't have a value, and `invalid` if its value doesn't match the provided `rule` expression:
```jsx
<Field.Input name="username" rule={/^\w+$/} required />
```

#### Recommendations
Synchronous Field validation is meant for the cases when a certain field should have the highest validation rule applied in a particular scenario. It is highly recommended to declare the validation rules as shown in the [Usage examples](#usage-examples).

### Form rules
Going higher, you can declare the same `rules` as you pass to fields on a form level as well. This synchronous validation has a lower priority than field rules, but higher priority than [asynchronous rules](#asynchronous-field-rules).

The `rules` prop expected by the form should be an Object of the following structure:
```jsx
import validationRules from './path/to/validation/rule';

<Form rules={ validationRules }>
  <Field.Input name="firstName" />
</Form>
```
Read more about how to declare [validation rules](./validation-rules.md).

### `FormProvider` rules
The recommended way of using sync form validation is to pass the `rules` property to the `<FormProvider>` at the top level of your application:
```jsx
import validationRules from './path/to/validation/rules';
<FormProvider rules={ validationRules}>
  <div id="my-app">...</div>
</FormProvider>
```
Read more about how to declare [validation rules](./validation-rules.md).

This way the rules you provide are applied application-wise, meaning that each `<Form>` rendered within the provider, regardless of the depth, will follow them. In case of necessity, you can use custom [Form rules](#form-rules) to override the global ones for a certain form.

### Asynchronous Field rules
#### `asyncRule?: ({ value, fieldProps, fields, formProps }) => Promise<boolean>`
Async validation, as stated in its name, uses an async request to a remote end-point responsible for validating the field's value.

```jsx
<Form>
  <Field.Input
    name="username"
    asyncRule={({ value }) => {
      return fetch('https://backend.dev/validate/', {
        method: 'POST',
        body: JSON.stringify({
          username: value
        })
      });
    }} />
</Form>
```
> **Note:** Make sure to return a `Promise` in the `asyncRule`.

## Usage examples
The recommended way of declaring your validation rules is to have just one rules Object responsible for global rules. Then, pass this Object to the `FormProvider` as the `rules` prop. All forms rendered as children of `FormProvider` will inherit those rules and behave as described.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { FormProvider } from 'react-advanced-form';
import validationRules from '../validation-rules';
import validationMessages from '../validation-messages';

const App = ({ children }) => (
  <FormProvider rules={ validationRules } messages={ validationMessages }>
    { children }
  </FormProvider>
);

ReactDOM.render(<App />, container);
```

You would usually declare `FormProvider` at the very top of your application components tree (the same way you declare `Provider` from Redux, `ApolloProvider` from Apollo, and so on).

## Cutom callbacks
You can hook into different states of the validation using the exposed callback methods below.

### `Form.props.onInvalid?: ({ fields, invalidFields, formProps }) => void`

#### Arguments
| Property | Type | Description |
| -------- | ---- | ----------- |
| `fields` | `Object` | Collection of validated fields. |
| `invalidFields` | `Array<Object>` | List of invalid fields ordered by the appearance in the form (from top to bottom). |
| `formProps` | `Object` | Self-explanatory. |

#### Example
```jsx
import React from 'react';
import { Form } from 'react-advanced-form';

export default class MyForm extends React.Component {
  handleInvalidForm = ({ fields, invalidFields, formProps }) => {
    ...
  }

  render() {
    return (
      <Form onInvalid={ this.handleInvalidForm }>
        <Field.Input name="username" required />
      </Form>
    );
  }
}
```

## Manual validation
Some use cases require to validate the form manually. For that, you can call an internal `validate()` function on a form.

```jsx
import React from 'react';
import { Form } from 'react-advanced-form';

export default class MyForm extends React.Component {
  handleManualValidation = () => {
    this.myForm.validate().then((isFormValid) => {
      if (isFormValid) {
        ...
      } else {
        ...
      }
    });
  }

  render() {
    return (
      <div>
        <Form ref={ form => this.myForm = form }>
          <Form.Input name="inputOne" required />
        </Form>
        <button onClick={ this.handleManualValidation }>Validate manually</button>
      </div>
    );
  }
}
```

Form validation has asynchronous nature. That means, `Form.validate()` always returns a Promise, and you should handle it respectively. For the comfort's sake, you may consider [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function):
```jsx
handleManualValidation = async () => {
  const isFormValid = await this.myForm.validate();
}
```
`Form.validate()` should literally never throw, therefore it's safe to use it without explicitly wrapping it in a `try/catch` block.
