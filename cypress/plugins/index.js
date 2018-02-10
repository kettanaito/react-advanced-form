// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const path = require('path');
const webpack = require('@cypress/webpack-preprocessor');

const webpackOptions = {
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        loader: 'babel-loader',
        options: {
          presets: ['env', 'react'],
          plugins: ['transform-class-properties']
        }
      }
    ]
  },
  resolve: {
    alias: {
      '@scenarios': path.resolve(__dirname, '../scenarios'),
      '@components': path.resolve(__dirname, '../components'),
      '@lib': path.resolve(__dirname, '../../lib')
    },
    extensions: ['.spec.jsx', '.spec.js', '.jsx', '.js']
  }
}

const options = {
  webpackOptions,
  watchOptions: {}
};

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('file:preprocessor', webpack(options))
}
