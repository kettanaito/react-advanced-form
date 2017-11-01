module.exports = {
  env: {
    browser: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 7,
    ecmaFeatures: {
      classes: true,
      modules: true,
      jsx: true
    }
  },
  extends: ['airbnb-base', 'airbnb-base/legacy'],
  plugins: ['react', 'import'],
  settings: {
    'import/resolver': {
      webpack: {
        config: './webpack.config.js'
      }
    }
  },
  rules: {
    'no-console': 1,
    'max-len': [1, 120],
    'consistent-return': 0,
    'array-callback-return': 0,
    'import/no-extraneous-dependencies': 0,
    'arrow-body-style': 0
  }
};
