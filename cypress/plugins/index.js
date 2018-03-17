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
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'raw-loader']
      }
    ]
  },
  resolve: {
    alias: {
      '@examples': path.resolve(__dirname, '../../examples'),
      '@fields': path.resolve(__dirname, '../../examples/fields'),
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
  on('file:preprocessor', webpack(options))
};
