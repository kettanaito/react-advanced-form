# Contributing

* [Technologies](contributing.md#technologies)
* [General agreements](contributing.md#general-agreements)
  * [Versioning](contributing.md#versioning)
  * [Naming conventions](contributing.md#naming-conventions)
  * [Git workflow](contributing.md#git-workflow)
* [Getting started](contributing.md#getting-started)
* [Commands](contributing.md#commands)
* [Other contributions](contributing.md#other-contributions)

## Foreword

First of all, thank you for deciding to contribute to React Advanced Form! It is only by the power of the community we can achieve great results.

## Technologies

A good place to start is to ensure you are familiar with the technologies used in React Advanced Form.

* **Development:**
  * [React](https://reactjs.org/) to power the components
  * [ImmutableJS](https://facebook.github.io/immutable-js) for variables management
* **Testing:**
  * [Chai](http://chaijs.com/) as the assertion library
  * [Mocha](https://mochajs.org/) for plain unit tests
  * [Enzyme](http://airbnb.io/enzyme/) for React unit tests
  * [Cypress](https://www.cypress.io/) for integration tests.

## General agreements

Please read and respect the internal agreements listed below. The latter are to ensure the quality and seamless coding approach during the development of the library.

### Versioning

* Please **do not** version the changes you provide. Versioning happens by the repository's owners after your changes are merged into the `master` branch.

### Naming conventions

1. Use `PascalCase` and `.jsx` extension for React components.
2. Use `cammelCase` and `.js` extension for other JavaScript files.
3. Use `.spec.js` suffix for the test files.
4. Be familiar with the [Naming Cheatsheet](https://github.com/kettanaito/naming-cheatsheet). It contains quite a few of patterns and pieces of advice on how to name the methods, variables and anything in general.
5. Once the review is passed, merge your pull request or ask somebody else to do so. Your contribution is now merged into the `master` and prepared for the next release!

### Git workflow

1. Create a new branch with the proper prefix. Use `feature` prefix for new features, `bugfix` for bugfixes and `dev` for internal \(i.e. architectural\) improvements. **Examples:** `feature/field-format`, `bugfix/form-clear`, `dev/bundle-size`.
2. Contribute the changes.
3. Add the changes with `git add`.
4. Commit the changes with `git commit`.
5. `git checkout master` and `git pull --rebase` to pull the latest changes from the `master` branch.
6. `git checkout PREFIX/YOUR_FEATURE_BRAHC` and `git rebase master` to ensure your feature branch is up-to-date.
7. Create a [Pull request](https://github.com/kettanaito/react-advanced-form/pulls) in the React Advanced Form repository.
8. Pass the code review and implement possible suggestions and comments from the repository's maintainers and owners.

## Getting started

### Clone the repository

```text
git clone https://github.com/kettanaito/react-advanced-form.git
```

### Install the dependencies

```text
cd react-advanced-form
npm install
```

### Run the Storybook

Start the development process by executing the following command in the terminal:

```text
npm start
```

This will launch the Storybook server at [http://localhost:6009](http://localhost:6009).

### Contribute

Development process generally consist of the following steps:

1. Create a test scenario \(story\) to test your changes.
2. Import a source fields of the library into the created story.
3. Develop with live updates.

### Write tests

**IT IS MANDATORY TO COVER YOUR CHANGES WITH THE CORRESPONDING TESTS.**

Depending on the character of your changes, it may be a unit test\(s\), integration test\(s\), or both. Please read more on the [Testing guidelines](testing.md), as well as some test examples in the respective section of the documentation.

### Commit the changes

Follow the [Git workflow](contributing.md#git-workflow) described above.

Each your commit is followed by an automated build and tests run toward your changes. It is only when the build succeeded and all tests passed your commit is being created. Make sure to fix all the issues which may happen during this process.

### Create a Pull request

Create [a new pull request](https://github.com/kettanaito/react-advanced-form/pulls) featuring your changes in the RAF repository. Assign the pull request to one of the library owners or contributors and await for the comment or approval. Pull request are merged into `master` branch by its reviewer.

## Commands

| Command | Description |
| --- | --- |
| `npm start` | Runs Storybook. |
| `npm test` | Runs all the tests \(unit and integration\). |
| `npm run cypress` | Opens Cypress GUI. |
| `npm run test:unit` | Runs unit tests. |
| `npm run test:integration` | Runs integration tests. |
| `npm run build` | Performs a production build. |

## Other contributions

Above there are the guidelines for the development contribution, but that isn't the only way you can make RAF better:

* Share your wisdom and help others in the opened [Issues](https://github.com/kettanaito/react-advanced-form/issues).
* Contribute to the [Official documentation](https://kettanaito.gitbooks.io/react-advanced-form), which is a part of the RAF repository.
* Star and share React Advanced Form if you find it useful

Each of your contributions counts! Thank you.

