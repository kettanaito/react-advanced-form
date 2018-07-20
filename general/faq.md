# FAQ

* General
  * [When to use React Advanced Form?](faq.md#when-to-use-react-advanced-form)
  * [Why should I switch to React Advanced Form?](faq.md#why-should-i-switch-to-react-advanced-form)
  * [How different is it from the other solutions?](faq.md#how-different-is-it-from-the-other-solutions)
* Architecture
  * [How does React Advanced Form work?](faq.md#how-does-react-advanced-form-work)
  * [Shouldn't usage of `context` be avoided?](faq.md#shouldnt-usage-of-context-be-avoided)
  * [Do you expect me to use `context` in my application?](faq.md#do-you-expect-me-to-use-context-in-my-application)
  * [Do my custom fields need to use `context`?](faq.md#do-my-custom-fields-need-to-use-context)
  * [Should all my fields be uncontrolled?](faq.md#should-all-my-fields-be-uncontrolled)
  * [Why `action` must always return a `Promise`?](faq.md#why-action-must-always-return-a-promise)

## General

### When to use React Advanced Form?

Whenever you need a flexible and powerful form for your [React](https://reactjs.org)-based projects. There are no restrains or limitations regarding where React Advanced Form cannot be used: it's lightweight, full of features and scales gracefully for small and large applications.

### Why should I switch to React Advanced Form?

We have researched various form libraries to find the one which would suit our project's needs. It sounds easy, but in reality there wasn't a single library which would take care of forms gracefully, without unnecessary boilterplate, manual state management or architectural dependencies. If you want a library which "just works", without spending a week on configuring it, React Advanced Form is exactly what you need.

Read more about the [motivation and thoughts](concept.md) behind React Advanced Form and how it came to be.

### How different is it from the other solutions?

* **Boilerplate-free**. There are smaller and faster form libraries than React Advanced Form, but the amount of the repetitive and, frankly, unnecessary code they force you to write is abnormal. React Advanced Form handles all the essential functionality of the form by itself, giving you a pleasure and flexbility to work with the forms.
* **Essentials**. React Advanced Form provides you the essential hooks and callbacks often used when crafting a form. Want to know when the submit started? Or, if it has failed? Want your UI to react correspondingly? No need to keep that information in state, you can access the internal hooks of the `Form` and know it _precisely_. You are not the one to handle the form functionality, the form library should.
* **Intuitive**. You place the `Form` component, define the fields you need and it works. No obscure fields definition somewhere else, no strange handlers you need to write, no tons of documentation to read. Forms are meant to be simple to use.

## Architecture

### How does React Advanced Form work?

It efficiently manages the immutable internal state using principles of reactive programming. A proper relationship between the form and the field components is achieved by using the [context](https://reactjs.org/docs/context.html) feature of React.

### Shouldn't usage of `context` be avoided?

Yes and no.

Context isn't something you would want to use in your applications by yourself, since it behaves differently from what you would expect, and doesn't contribute much to the overall patterns of React. However, some libraries do rely on it \(Redux, Apollo\), and it's fine until you [do it properly](https://medium.com/react-ecosystem/how-to-handle-react-context-a7592dfdcbc).

### Do you expect me to use `context` in my application?

No, never use context in your applications.

React Advanced Form handles context safely, providing you all the necessary hooks and callbacks so you don't need to do anything with the context at all.

### Do my custom fields need to use `context`?

No, never use context in your applications.

You need not to access any context in order to implement beautiful custom fields. Use a native `createField` high-order component to get all the necessary props of the field you are about to style.

### Should all my fields be uncontrolled?

_You_ are in charge of what is controlled and what is not. By default, React Advanced Form will handle all state changes behind the scenes, since in most scenarios controlling the fields by yourself is an overkill. You are being provided plenty of hooks and methods to make your impementation lighter, and strive towards _stateless_ forms.

However, in case you need to control the fields, you can always do so by providing the `value` and `onChange` props to the fields. This will make them controllable by you, and React Advanced Form will no longer be in charge of updating their value. You would still benefit from all the features of React Advanced Form in this case.

### Why `action` must always return a `Promise`?

Forms are used to request the data from a user in a pleasant way, and transform/translate it afterward. It's rare you would use a form for something different. Considering that, React Advanced Form is specifically designed to handle asynchronous nature of data transition during the workflow with the form. This also gives you a granular control over how your request is being handled, so you can change the UI respectively. Read more about submit callback methods.

However, React Advanced Form never enforces you to handle things in one way only. You can use it without any `action` specified at all, [handling the submit manually](../components/form/methods/submit.md). You still benefit from all the features of React Advanced Form in this case.

