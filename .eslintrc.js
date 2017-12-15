module.exports = {
  env: {
    browser: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 7,
    ecmaFeatures: {
      classes: true,
      jsx: true,
      modules: true
    }
  },
  extends: ['airbnb-base', 'airbnb-base/legacy'],
  plugins: ['react', 'import', 'mocha'],
  env: {
    'mocha': true
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
    'no-console': 1,
    'max-len': [1, 120],
    'consistent-return': 0,
    'array-callback-return': 0,
    'import/no-extraneous-dependencies': 0,
    'arrow-body-style': 0,
    'object-curly-newline': 0,
    'no-mixed-operators': 0,
    'no-plusplus': 0,
    'no-shadow': 0,
    'func-names': 0,
    'no-param-reassign': 0,
    'import/prefer-default-export': 0,
    'class-methods-use-this': 0,
    'no-prototype-builtins': 0,

    /* React */
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
    'react/react-in-jsx-scope': 2,

    /* Mocha */
    'mocha/no-exclusive-tests': 'error'
  }
};
