# Concept

## The motivation

This library has been concieved after numerous attempts to come up with the solution I would personally prefer. Neither of the existing form libraries satisfied my expectations toward this topic. Some were overcomplicating the code, others required absurd amount of boilerplate to write in order to get a simple form working. Needless to say, even the most popular form libraries lacked, what seemed, the crucial features the one would expect \(i.e. field formatting or control over serialized data\). To be honest, I am not following those libraries now, and there is a high chance they adopted those features by the time React Advanced Form lands. But at the time I needed them, they were nowhere.

## Idea

### Simplicity

The form should work as simple as including required components, configuring them with the _props_ and... that's all. I personally find extra configurations "from outside" and even manual `onChange` management of each field as a huge overkill you don't need in 99% of use cases. Don't get me wrong, I cherish the idea of controlled components, and controlled form inputs as well, but when this is really benefitial to the developer.

Consider this example:

```jsx
import React from 'react';
import { Form } from '...';
import { Input } from '...';

export default class RegistrationForm extends React.Component {
  registerUser = () => {
    // ...
  }

  render() {
    return (
      <Form action={ this.registerUser }>
        <Input
          name="username"
          required />
        <Input
          name="password"
          type="password"
          required />
      </Form>
    );
  }
}
```

Everything has been provided in order for the form to work: which fields are in the form, their requirement state, and what should happen on form submit. That should be literally all you need to setup the simpliest form.

**However**, the form shouldn't be excessively simple either. This would mean that the library deligates too much on the shoulders of the developer, forcing him to write things which should be within by form \(field updates, validation, serialization\).

### Versatile

The form should be, although simple, but rich for the features which may be needed. I don't find a simple fields rendering system as a sufficient solution for real-world applications. I don't want to write boilerplate code each time I want to create a new form. I expect the form to handle what it was designed to handle.

#### Field management

React Advanced Form _still_ keeps the fields as controlled components. The difference is that they are controlled on the Form level, depriving the developer of unnecessary `onChange` handlers just for the sake of keeping the fields data somewhere. The one can still make the field controlled, just as the one would do normally: by providing the `value` and `onChange` props. However, this is not forced at all.

#### Validation

The developer is but to provide the validation rules applicable to the form and validation messages displayed correspondingly to those rules. He shouldn't handle the process of validation as is, but should be able to hook into it in case of necessity.

Read more on how [Validation](../validation/getting-started.md) works in RAF.

#### Serialization

When the Form is the one handling serialization, the latter becomes a pure function. You never really want to distort the logic or the output of field serialization. What you often want is to reshape the serialized Object at a certain point \(i.e. just before sending to the remote end-point\). That use case should not be covered during the serialization process, but rather in some submit callback handler.

#### Submit callback handlers

Form should tell you when it starts submitting, had submitted or failed while doing so. You are not the one who should to determine when those events happen.

### Styling

You couldn't find a modern website which uses native form elements. Custom form styles has become a must in modern design, and for a good reason. That means this should apply to the form you are using as well.

There were a few key points toward custom styling: 1. It should be separated from the form logic. 1. It should be easy to use. 1. It should be completely up to developer how the field should look like.

## Drawbacks

### Library size

Each choice echoes with the consequence. As the form handles quite a few things on its own, it will, eventually, be bigger in size than compared with the other solutions, which tend to give all these responsibilities to the end developer. However, in the long run, if you sum up the amount of boilerplate those libraries expect from you, the code size would be much bigger than using a solution which does the essentials for you.

### Context

Using of context opens a lot of great features to the form, but should be treated carefully.

