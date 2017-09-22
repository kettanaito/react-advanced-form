module.exports = {
  parser: 'babel-eslint',
  env: {
    node: true,
    browser: true
  },
  extends: ['airbnb-base', 'airbnb-base/legacy'],
  parserOptions: {
    ecmaVersion: 8,
    ecmaFeatures: {
      classes: true,
      modules: true
    }
  }
};
