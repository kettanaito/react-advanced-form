# FAQ (Frequently asked questions)

## General questions
<details>
  <summary>When to use React Advanced Form?</summary>
  <p>Whenever you need a flexible and powerful form for your <a href="https://reactjs.org/">React<a/>-based projects. There are no restrains or limitations regarding where React Advanced Form cannot be used, as it's suitable for both small and large applications.
</details>

<details>
  <summary>Why should I switch to React Advanced Form?</summary>
  <p>We have researched various form libraries to find the one which would suit us. It sounds easy, but in reality there wasn't a single library which would take care of forms gracefully, without unnecessary boilterplate, manual state management or architectural dependencies. If you want a library which "just works", without spending a week on configuring it, React Advanced Form is exactly what you need.</p>
</details>

<details>
  <summary>How is it different from ReduxForm?</summary>
  <p>ReduxForm deligates the state of the each form to the Redux store, while React Advanced Form handles the state within the <code>Form</code> component. You may not always need ReduxForm, as well as you <a href="https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367">might not always need Redux</a> in general. React Advanced Form doesn't enforce you to use either.</p>
</details>

## Implementation questions
<details>
  <summary>How does React Advanced Form works?</summary>
  <p>It keeps the fields in the form's state and manages them via internal callback methods. Relationship between the form and various of field components is achieved by accessing the <a href="https://reactjs.org/docs/context.html">context</a>.</p>
</details>

<details>
  <summary>Wait, shouldn't usage of <code>context</code> be avoided?</summary>
  <p>Yes and no. Context is not something you would want to use in your applications by yourself, since it behaves differently from what you would expect, and doesn't contribute much to the overall patterns of React. However, some libraries do rely on it (Redux, Apollo), and it's fine until you <a href="https://medium.com/react-ecosystem/how-to-handle-react-context-a7592dfdcbc">do it properly</a>.</p>
</details>

<details>
  <summary>Do you expect me to use <code>context</code> in my application?</summary>
  <p>No, never use context in your applications.</p>
  <p>React Advanced Form handles context safely, providing you all the necessary hooks and callbacks so you don't need to touch context at all.</p>
</details>

<details>
  <summary>Do my custom styled fields need to access the <code>context</code>?</summary>
  <p>No, never use context in your applications.</p>
  <p>You need not to access any context in order to implement beautiful custom fields. Use a native <code>connectField</code> decorator to get all the necessary props of the field you are about to style. Read more about <a href="./docs/custom-styling.md">custom styling</a>.</p>
</details>

<details>
  <summary>Should all my fields be uncontrolled?</summary>
  <p><i>You</i> are in charge of what is controlled and what is not. By default, React Advanced Form will handle all state changes behind the scenes, since in most scenarios controlling the fields by yourself is an overkill. You are being provided plenty of hooks and methods to make your impementation lighter, and strive towards <i>stateless</i> forms.</p>
  <p>However, in case you need to control the fields, you can always do so by providing the <code>value</code> and <code>onChange</code> props to the fields. This will make them controllable by you, and React Advanced Form will no longer be in charge of updating their value. You would still benefit from all the features of React Advanced Form in this case.</p>
</details>

<details>
  <summary>Why <code>action</code> should always return a Promise?</summary>
  <p>Forms are used to request the data from a user in a pleasant way, and transform/translate it afterward. It's rare you would use a form for something different. Considering that, React Advanced Form is specifically designed to handle asynchronous nature of data transition during the workflow with the form. This also gives you a granular control over how your request is being handled, so you can change the UI respectively. Read more about <a href="./docs/submit.md#callback-methods">submit callback methods</a>.</p>
  <p>However, React Advanced Form never enforces you to handle things in one way only. You can use it without any  <code>action</code> specified at all, <a href="./docs/submit.md#manual-submit">handling the submit manually</a>. You still benefit from all the features of React Advanced Form in this case.</p>
</details>
