const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const webpackPreprocessor = require('@cypress/webpack-preprocessor')
const storybookWebpackConfig = require('../../.storybook/webpack.config')
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
        // exclude: /node_modules/,
        use: ['style-loader', 'raw-loader'],
      },
    ],
  },
  resolve: {
    alias: storybookWebpackConfig.resolve.alias,
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
