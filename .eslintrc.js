module.exports = {
  extends: ['airbnb-base', 'airbnb-base/legacy'],
  plugins: ['react', 'import', 'mocha'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    ecmaFeatures: {
      classes: true,
      jsx: true,
      modules: true
    }
  },
  env: {
    browser: true,
    mocha: true,
    es6: true
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: './webpack.config.js'
      }
    }
  },
  rules: {
    'strict': [2, 'never'],
    'no-console': 0,
    'max-len': [1, 120],
    'consistent-return': 0,
    'semi': 0,
    'comma-dangle': 0,
    'array-callback-return': 0,
    'arrow-body-style': 0,
    'object-curly-newline': 0,
    'no-mixed-operators': 0,
    'no-plusplus': 0,
    'no-shadow': 0,
    'func-names': 0,
    'no-param-reassign': 0,
    'class-methods-use-this': 0,
    'no-prototype-builtins': 0,
    'no-await-in-loop': 0,
    'no-return-assign': 0,
    'function-paren-newline': 0,
    'prefer-promise-reject-errors': 0,
    'no-confusing-arrow': 0,
    'padded-blocks': 0,
    'no-underscore-dangle': 0,

    /* Import */
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'import/no-named-as-default-member': 0,

    /* React */
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
    'react/react-in-jsx-scope': 2,

    /* Mocha */
    'mocha/no-exclusive-tests': 'error'
  }
};
