# Contributing

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

## General agreements
Please read and respect the internal agreements listed below. The latter are to ensure the quality and seamless coding approach during the development of the library.

### Versioning
* Please **do not** version the changes you provide. Versioning happens by the repository's owners after your changes are merged into the `master` branch.

### Naming conventions
1. Use `PascalCase` and `.jsx` extension for React components.
1. Use `cammelCase` and `.js` extension for other JavaScript files.
1. Use `.spec.js` suffix for the test files.
1. Be familiar with the [Naming Cheatsheet](https://github.com/kettanaito/naming-cheatsheet). It contains quite a few of patterns and pieces of advice on how to name the methods, variables and anything in general.
1. Once the review is passed, merge your pull request or ask somebody else to do so. Your contribution is now merged into the `master` and prepared for the next release!

### Git workflow
1. Create a new branch with the proper prefix. Use `feature` prefix for new features, `bugfix` for bugfixes and `dev` for internal (i.e. architectural) improvements. **Examples:** `feature/field-format`, `bugfix/form-clear`, `dev/bundle-size`.
1. Contribute the changes.
1. Add the changes with `git add`.
1. Commit the changes with `git commit`.
1. `git checkout master` and `git pull --rebase` to pull the latest changes from the `master` branch.
1. `git checkout PREFIX/YOUR_FEATURE_BRAHC` and `git rebase master` to ensure your feature branch is up-to-date.
1. Create a [Pull request](https://github.com/kettanaito/react-advanced-form/pulls) in the React Advanced Form repository.
1. Pass the code review and implement possible suggestions and comments from the repository's maintainers and owners.

## Getting started
### Clone the repository
```
git clone https://github.com/kettanaito/react-advanced-form.git
```

### Install the dependencies
```
cd react-advanced-form
npm install
```

### Run the library
You can run the development build by:

```
npm start
```

Or, alternatively, run Storybook by:
```
npm run storybook
```

### Contribute!
Now your local repository is ready for an amazing contribution! Make sure to follow the [General agreements](#general-agreements) for your contribution to be seamless.

### Build
Build the changes you have implemented by running:

```
npm run build
```

This will build the production bundle of the library.

### Test
Regardless of whether your changes are aimed to provide a new feature, fix an existing bug or improve the current architecture, you should always test them. Pull requests which do not pass the CI tests are not going to be merged, unless you resolve the failing tests.

To test React Advanced Form run:
```
npm test
```

> **Note:** Beware that tests are executed against the *built* version of the library. Make sure to build the latter by `npm run build` for objective test results.

You are responsible for writing the new tests to test your changes, if any. Please see existing tests to learn how those are written and organized.

### Create a Pull request
Create a new pull request featuring your changes in the RAF repository. Pass the code review and your changes will be ready for the next release.

## Other contributions
Above there are the guidelines for the development contribution, yet that is not the only way you can make RAF better:

* Share your wisdom and help others in the opened [Issues](https://github.com/kettanaito/react-advanced-form/issues).
* Contribute to the [Official documentation](https://kettanaito.gitbooks.io/react-advanced-form), which is a part of the RAF repository.
* Star and share React Advanced Form if you find it useful

Each of your contributions counts! Thank you.
