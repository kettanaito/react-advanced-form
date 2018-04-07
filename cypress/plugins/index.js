const path = require('path');
const webpack = require('webpack');
const webpackPreprocessor = require('@cypress/webpack-preprocessor');
const storybookWebpackConfig = require('../../.storybook/webpack.config');

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
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'raw-loader']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  resolve: {
    alias: storybookWebpackConfig.resolve.alias,
    extensions: ['.spec.jsx', '.spec.js', '.jsx', '.js']
  }
}

const options = {
  webpackOptions,
  watchOptions: {}
};

module.exports = (on, config) => {
  on('file:preprocessor', webpackPreprocessor(options))
};
