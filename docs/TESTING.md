# Testing

Proper and thorough testing is a guarantee of stable and reliable implementation. Please write tests, whether that's unit or integration ones (or both) when contributing to React Advanced Form to make sure the library performs on its best.

Below, there are goine to be some guidelines on how to write the tests and which technologies are used during the development of the library.

## CLI
**Run all tests:**

```bash
npm test
```

**Run all unit tests:**

```bash
npm run test:unit
```

**Run all integration tests:**
```bash
npm run test:integration
```

**Run integration tests in Cypress GUI:**
```bash
npm run cypress
```

## Unit tests
* [enzyme](https://github.com/airbnb/enzyme)
* [mocha](https://mochajs.org/)
* [chai](http://chaijs.com/)

### Folder structure
* **./test/**
  * **common/**. Useful tools and shorthands to help in testing.
  * **components/**. React components for Enzyme unit tests.
  * **unit/**. Unit tests themselves.
    * **classses/**. Unit tests for separate classes (i.e. `Sequence`).
    * **components/**. Unit tests for React components.
    * **utils/**. Unit tests for various utility functions.
  * **jsdom.config.js**. Configuration for `jsdom`, ysed for emulating the DOM during Enzyme unit tests.

### Workflow
0. (*Optional*) Provide any helpers and utils required for your test.
1. Create a new test under the respective folder within `./test/unit/`.
1. Connect your test by `require('./path/to/your/test');` within the respective barrel file (`index.js`) of the directory, so that your test appears in the list of all unit tests.
1. Run all unit tests by `npm run test:unit`. Ensure all tests are passing, including your new ones.

### Unit test example
Let's say we are going to add a new `fieldUtils` function to help the library to handle certain logic with fields. We start from the adding the function itself:

```js
// src/utils/fieldUtils/newMethod.js
export default function newMethod({ fieldProps }) {
  return fieldProps;
}
```

Let's export the `newMethod` so it would be available as `fieldUtils.newMethod`:

```js
// src/utils/fieldUtils/index.js
export newMethod from './newMethod';
```

Now, let's create a unit test to ensure our brand-new `newMethod` is working properly:

```js
// test/unit/utils/newMethod.js
import { fieldUtils } from '../../src/utils';
describe('newMethod', function () {
  it('returns passed "fieldProps"', () => {
    const fieldProps = { name: 'foo' };
    const payload = fieldUtils.newMethod({ fieldProps });
    expect(payload).to.deep.equal(fieldProps);
  });
});
```

> **Note:** Since we are testing an *internal* utility function, we are importing it from source files directly. However, please test the functionality exposed in the built package by **importing the built (`lib`) package instead**.

As the last step, let's run the tests to make sure our implementation is correct, and it doesn't break the existing implemenetation as well:

```bash
npm run test:unit
```

All tests have passed and our change is ready to be committed!

## Integration tests
* [Cypress](https://www.cypress.io/)

### Folder structure
* **./cypress/**
  * **components/**. Set of React components used in the integration scenarios.
  * **integration/**. The integration tests themselves.
  * **plugins/**. Plugins for Cypress.
  * **scenarios/**. List of testing scenarios, later included in the integration test files.
  * **support/**. Utils and helpers for Cypress.

> **Note:** Integration test files are split into dedicated folders, so that the tests responsible for validation are under `validation/` folder, and so on. Please respect a clean and meaningful folder structure while writing tests.

### Workflow
0. (*Optional*) Provide any utils or helpers needed for your integration test(s).
1. Add a new integration test file under the respective folder in `./cypress/integration/`.
1. Write an appropriate test scenario under `./cypress/scenarios`.
1. Connect the scenario in your integration test file.
1. Run the integration tests by `npm run test:integration`. Ensure all tests are passing, including your new ones.

### Example
Let's say we have enhanced the synchronous validation algorithm and now we need to cover our change in a form of writing an integration test.

First, let's create a new integration test file under the `validation/SyncValidation` directory, as our test relates to synchronous validation:

```jsx
// cypress/integration/validation/SyncValidation/enhanced.algorithm.spec.jsx
import React from 'react';
import { mount } from 'cypress-react-unit-test';
import Scenario, { fieldSelector } from '@scenarios/SyncValidation/EnhancedAlgorithm.jsx';

describe('Enhanced algorithm', () => {
  it('Does what it is meant to do', () => {
    mount(<Scenario someProp="foo" />);

    cy.get(fieldSelector)
      .type('foo').should('have.value', 'foo')
      .should('have.class', 'valid');
  });
});
```

Now, let's write the scenario:

```jsx
// cypress/scenarios/SyncValidation/EnhancedAlgorithm.jsx
import React from 'react';
import { Form } from '@lib';
import { Input } from '@components';

export default class EnhancedAlgorithm extends React.Component {
  render() {
    return (
      <Form>
        <Input name="foo" { ...this.props } />
      </Form>
    );
  }
}
```

> **Note:** You need to include the *built* version of the library (from `@lib`), while field components are imported from `./cypress/components` alias, which is `@components`.

Now, let's include our new integration test into the `SyncValidation` tests for it to appear in the list of all validation-related tests:

```js
// cypress/integration/SyncValidation/index.js
require('./EnhancedAlgorithm');
```

During the development it is faster to run our new integration test(s) directly. Do so via Cypress GUI:

```bash
npm run cypress
```

However, after our test looks great, we need to make sure the changes do not affect other tests. For that, we must run all integration tests using the following command:

```bash
npm run test:integartion
```

Great! Our new test and all other tests are passing, so the change is ready to be committed!
