const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const webpackPreprocessor = require('@cypress/webpack-preprocessor')
const aliases = require('../../.storybook/webpack.alias')
const babelConfig = require('../../babel.config')

const webpackOptions = {
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: babelConfig,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'raw-loader'],
      },
    ],
  },
  resolve: {
    // Get this fucking webpack config from storybook
    // because somebody smart assumed it's fucking genious
    // to hide plain objects in getter functions requiring
    // extension of existing config. Fuck.
    alias: aliases,
    extensions: ['.group.spec.js', '.spec.jsx', '.spec.js', '.jsx', '.js'],
  },
}

const getConfigFile = (envName) => {
  const configFilename = ['cypress', envName, 'json'].filter(Boolean).join('.')
  console.log(chalk.cyan(`Cypress: Loading config "${configFilename}"`))
  return fs.readJson(path.resolve(__dirname, '..', '..', configFilename))
}

module.exports = (on, config) => {
  on(
    'file:preprocessor',
    webpackPreprocessor({
      webpackOptions,
      watchOptions: {},
    }),
  )

  const { envName } = config.env || ''
  return getConfigFile(envName)
}
