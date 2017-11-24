const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json');

const DEVELOPMENT = (process.env.NODE_ENV === 'development');

module.exports = {
  cache: true,
  entry: path.resolve(__dirname, packageJson.source),
  externals: {
    react: 'React',
    immutable: 'immutable'
  },
  output: {
    path: __dirname,
    filename: packageJson.main,
    library: packageJson.name,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      }
    ]
  },
  devtool: DEVELOPMENT && 'source-map',
  resolve: {
    extensions: ['.jsx', '.js',]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'test'),
    port: 9004
  }
};
