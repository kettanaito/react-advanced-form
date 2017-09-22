const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json');

const DEVELOPMENT = (process.env.NODE_ENV === 'development');

module.exports = {
  watch: DEVELOPMENT,
  entry: path.resolve(__dirname, packageJson.source),
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
        test: /\.(j|t)sx?$/i,
        exclude: /node_modules/,
        use: ['babel-loader', 'awesome-typescript-loader', 'eslint-loader']
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: 'source-map-loader'
      }
    ]
  },
  externals: {
    react: 'React',
    immutable: 'immutable'
  },
  devtool: 'source-map',
  resolve: {
    extensions: [
      '.ts',
      '.tsx',
      './index.ts',
      './index.tsx',
      '.jsx',
      '.js',
      '.json'
    ]
  }
};
