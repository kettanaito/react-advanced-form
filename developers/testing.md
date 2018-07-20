# Testing

Proper and thorough testing is a guarantee of stable and reliable implementation. Please write tests, whether that's unit or integration ones \(or both\) when contributing to React Advanced Form to make sure the library performs on its best.

See the list of technologies used for testing and the guidelines on writing tests below.

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
    * **classses/**. Unit tests for separate classes \(i.e. `Sequence`\).
    * **components/**. Unit tests for React components.
    * **utils/**. Unit tests for various utility functions.
  * **jsdom.config.js**. Configuration for `jsdom`, ysed for emulating the DOM during Enzyme unit tests.

### Workflow

1. \(_Optional_\) Provide any helpers and utils required for your test.
2. Create a new test under the respective folder within `./test/unit/`.
3. Connect your test by `require('./path/to/your/test');` within the respective barrel file \(`index.js`\) of the directory, so that your test appears in the list of all unit tests.
4. Run all unit tests by `npm run test:unit`. Ensure all tests are passing, including your new ones.

### Unit test example

Let's say we are going to add a new `fieldUtils` function to help the library to handle certain logic with fields. We start from the adding the function itself:

```javascript
// src/utils/fieldUtils/newMethod.js
export default function newMethod({ fieldProps }) {
  return fieldProps;
}
```

Let's export the `newMethod` so it would be available as `fieldUtils.newMethod`:

```javascript
// src/utils/fieldUtils/index.js
export newMethod from './newMethod';
```

Now, let's create a unit test to ensure our brand-new `newMethod` is working properly:

```javascript
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

> **Note:** Since we are testing an _internal_ utility function, we are importing it from source files directly. However, please test the functionality exposed in the built package by **importing the built \(**`lib`**\) package instead**.

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
  * **support/**. Utils and helpers for Cypress.

> **Note:** Integration tests load components located in `examples/` folder. That is a unified directory to contain different scenarios, as well as having examples tested.

### Workflow

1. \(_Optional_\) Provide any utils or helpers needed for your integration test\(s\).
2. Add a new integration test file under the respective folder in `./cypress/integration/`.
3. Write an appropriate test scenario under `./cypress/scenarios`.
4. Connect the scenario in your integration test file.
5. Run the integration tests by `npm run test:integration`. Ensure all tests are passing, including your new ones.

