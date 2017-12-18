# FAQ (Frequently asked questions)

## General
<details>
  <summary>When to use React Advanced Form?</summary>
  <p>Whenever you need a flexible and powerful form for your <a href="https://reactjs.org/">React</a>-based projects. There are no restrains or limitations regarding where React Advanced Form cannot be used: it's lightweight, dependency-free and scales perfectly for small and large applications.
</details>

<details>
  <summary>Why should I switch to React Advanced Form?</summary>
  <p>We have researched various form libraries to find the one which would suit our project's needs. It sounds easy, but in reality there wasn't a single library which would take care of forms gracefully, without unnecessary boilterplate, manual state management or architectural dependencies. If you want a library which "just works", without spending a week on configuring it, React Advanced Form is exactly what you need.</p>
  <p>Read more about the <a href="./docs/concept.md">motivation and thoughts</a> behind React Advanced Form and how it came to be.
</details>

<details>
  <summary>How is it different from the other solutions?</summary>
  <ul>
    <li><strong>Boilerplate-free.</strong> There are smaller and faster form libraries than React Advanced Form, but the amount of the repetitive and, frankly, unnecessary code they force you to write is abnormal. React Advanced Form handles all the essential functionality of the form by itself, giving you a pleasure and flexbility to work with the forms.</li>
    <li><strong>Essentials.</strong> React Advanced Form provides you the essential hooks and callbacks often used when crafting a form. Want to know when the submit started? Or, if it has failed? Want your UI to react correspondingly? No need to keep that information in state, you can access the internal hooks of the <code>Form</code> and know it <i>precisely</i>. You are not the one to handle the form functionality, the form library should.</li>
    <li><strong>Intuitive.</strong> You place the <code>Form</code> component, define the fields you need and it works. No obscure fields definition somewhere else, no strange handlers you need to write, no tons of documentation to read. Forms are meant to be simple to use.</li>
  </ul>
</details>

## Technical
<details>
  <summary>How does React Advanced Form works?</summary>
  <p>It efficiently manages the state of the fields using Immutable instances, providing you various callback methods. A proper relationship between the form and the field components is achieved by using the <a href="https://reactjs.org/docs/context.html">context</a>.</p>
</details>

<details>
  <summary>Shouldn't the usage of <code>context</code> be avoided?</summary>
  <p>Yes and no.</p>
  <p>Context isn't something you would want to use in your applications by yourself, since it behaves differently from what you would expect, and doesn't contribute much to the overall patterns of React. However, some libraries do rely on it (Redux, Apollo), and it's fine until you <a href="https://medium.com/react-ecosystem/how-to-handle-react-context-a7592dfdcbc">do it properly</a>.</p>
</details>

<details>
  <summary>Do you expect me to use <code>context</code> in my application?</summary>
  <p>No, never use context in your applications.</p>
  <p>React Advanced Form handles context safely, providing you all the necessary hooks and callbacks so you don't need to do anything with the context at all.</p>
</details>

<details>
  <summary>Do my custom styled fields need to access the <code>context</code>?</summary>
  <p>No, never use context in your applications.</p>
  <p>You need not to access any context in order to implement beautiful custom fields. Use a native <code>connectField</code> decorator to get all the necessary props of the field you are about to style. Read more about <a href="./custom-styling.md">custom styling</a>.</p>
</details>

<details>
  <summary>Should all my fields be uncontrolled?</summary>
  <p><i>You</i> are in charge of what is controlled and what is not. By default, React Advanced Form will handle all state changes behind the scenes, since in most scenarios controlling the fields by yourself is an overkill. You are being provided plenty of hooks and methods to make your impementation lighter, and strive towards <i>stateless</i> forms.</p>
  <p>However, in case you need to control the fields, you can always do so by providing the <code>value</code> and <code>onChange</code> props to the fields. This will make them controllable by you, and React Advanced Form will no longer be in charge of updating their value. You would still benefit from all the features of React Advanced Form in this case.</p>
</details>

<details>
  <summary>Why <code>action</code> should always return a Promise?</summary>
  <p>Forms are used to request the data from a user in a pleasant way, and transform/translate it afterward. It's rare you would use a form for something different. Considering that, React Advanced Form is specifically designed to handle asynchronous nature of data transition during the workflow with the form. This also gives you a granular control over how your request is being handled, so you can change the UI respectively. Read more about <a href="./submit.md#callback-methods">submit callback methods</a>.</p>
  <p>However, React Advanced Form never enforces you to handle things in one way only. You can use it without any  <code>action</code> specified at all, <a href="./submit.md">handling the submit manually</a>. You still benefit from all the features of React Advanced Form in this case.</p>
</details>
