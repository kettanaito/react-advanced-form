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
    extensions: ['.spec.jsx', '.spec.js', '.jsx', '.js'],
  },
}

const options = {
  webpackOptions,
  watchOptions: {},
}

module.exports = (on) => {
  on('file:preprocessor', webpackPreprocessor(options))
}
