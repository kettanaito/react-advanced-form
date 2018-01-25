# Validation

## Overview
* [Declare validation rules](#rules-declaration)
* [Declare validation messages](#messages-declaration)
* [Apply the rules](#applying-rules)
* [Create a form](#creating-a-form)

## Introduction
Validation is the essential part of any form. React Advanced Form offers flexible, multi-layer vaidation system to suit **any** needs.

Due to the significant scale and technical depth of this topic, we will use a simple example of creating and validating Registration form. This should give you an overview of how to work with validation in React Advanced Form, sufficient enough to apply in your projects.

You can read the specification of each part of this example in the respective sections of "Validation" documentation.

## Rules declaration
First, let's declare the validation rules.

Validation rules are declared as a plain JavaScript Object with a specific structure. Although we are building an example form, we still need a real-world validation rules, no compromises here. This is how we expect our Registration form to be validated:

* Ensure corrent "email" format
* Ensure "password" is at least 6 characters long
* Ensure "password" has at least one capital letter
* Ensure "password" has at least one number
* Ensure "confirmPassword" field equals the "password" field

Sounds like a lot of rules, isn't it? You will be amazed how simple is to achieve this set of rules using React Advanced Form:

```js
// ./validation-rules.js
/* We will use external validation library to validate emails */
import isEmail from 'validator/lib/isEmail';

export default {
  type: {
    email: {
      format: ({ value, fieldProps, fields, form }) => isEmail(value)
    },
    password: {
      minLength: ({ value }) => (value.length > 6),
      capitalLetter: ({ value }) => value.test(/[A-Z]/g),
      oneNumber: ({ value }) => value.test(/[0-9]/g)
    }
  },
  name: {
    confirmPassword: {
      matches: ({ value, fields }) => (value === fields.password.value)
    }
  }
};
```

By breaking a single validation selector ("type", "name") into the named rules ("minLength", "oneNumber") we can set custom validation messages when each of that rules fails.

**Read the technical specification on [Validation rules](./validation-rules.md).**

## Messages declaration
Validation rules are great, but it's crucial our users see that the validation failed. For that, let's declare validation messages according to the validation rules we have defined above:

```js
// ./validation-messages.js
export default {
  type: {
    email: {
      missing: 'Please provide the email.',
      invalid: 'The email you provided has wrong format.'
    },
    password: {
      missing: 'Please provide the password.',
      invalid: 'The password you have provided is invalid.',
      minLength: 'Password must be at least 7 characters long.'
    }
  },
  name: {
    confirmPassword: {
      missing: 'Please confirm the password.',
      invalid: 'The passwords do not match.'
    }
  }
};
```

`missing` and `invalid` properties are present on each validation selector automatically, and represent the validation message when the required field is not provided or its value is invalid, respectivelly.

Other properties (like "minLength") are custom, and are connected to the same properties in the validation rules.

> **Note:** In case custom property is not provided, an `invalid` property will be used as a fallback message.

**Read the technical specification on [Validation messages](./validation-messages.md).**

## Applying rules
Now, as we have declared our [rules](#rules-declaration) and [messages](#messages-declaration), it is time to let the validation happen. For that we will use a [`FormProvider`](../components/formprovider.md) component, which will make all the forms in our application to follow the validation rules we have declared.

```jsx
// ./app.js
import React from 'react';
import ReactDOM from 'react-dom';
import { FormProvider } from 'react-advanced-form';
import validationRules from './validation-rules';
import validationMessages from './validation-messages';

const App = ({ children }) => (
  <FormProvider rules={ validationRules } messages={ validationMessages }>
    { children }
  </FormProvider>

ReactDOM.render(<App />, document.getElementById('root'));
);
```

> **Note:** You need to render `FormProvider` on the root level of your application. This is where all the other providers are (i.e. Redux's Provider).

It is recommended to apply the validation rules application-wide. This way all forms and all fields abide by the same validation logic, regardless of when and where they are rendered in your application.

## Creating a form
The last step, we need an actual Registration form component.

Notice that it's unlikely you will be using native `Field` components directly in your application. It is recommended to [style your fields](../general/customization.md#custom-styling) first, for the sake of appearance *and* displaying the validation status in the UI. **Native fields do not reflect the validation status by default.**

That being said, we will create a simple `Input` component based on `Field.Input`, and describe how we need to display the validation messages:

```jsx
// ./Input.js
import React from 'react';
import { createField } from 'react-advanced-form';
import { Input } from 'react-advanced-form';

class Input extends React.Component {
  render() {
    const { fieldProps, fieldState } = this.props;
    const { invalid, error } = fieldState;

    return (
      <div>
        <input { ...fieldProps } />

        { /* Display validation errors */ }
        { invalid && (<p style={{ color: 'red' }}>{ error }</p>) }
      </div>
    )
  }
}

export default createField()(Input);
```

Now let's create a simple Registration form:

```jsx
// ./RegistrationForm.js
import React from 'react';
import { Form } from 'react-advanced-form';
import Input from './Input';

export default class RegistrationForm extends React.Component{
  registerUser = ({ serialized }) => {
    console.log('Register the user with the data:', serialized);
  }

  render() {
    return (
      <Form action={ this.registerUser }>
        <Input type="email" name="email" required />
        <Input type="password" name="password" required />
        <Input type="password" name="confirmPassword" required />
        <button>Register</button>
      </Form>
    )
  }
}
```

Congratulations, the Registration form is ready!

See the source code of this example [here]().

## Conclusion
We have built a real-world Registration form with advanced validation logic in a few minutes. Of course, this is the demonstration of one particular form, while React Advanced Form offers much more.

Please read more on validation and other features in the further sections of this documentation.
