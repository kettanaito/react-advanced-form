const path = require('path');
const webpack = require('webpack');
const BabelMinifyPlugin = require('babel-minify-webpack-plugin');
const packageJson = require('./package.json');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const DEVELOPMENT = (process.env.NODE_ENV === 'development');
const PRODUCTION = (process.env.NODE_ENV === 'production');

module.exports = {
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),

    PRODUCTION && new BabelMinifyPlugin({
      removeConsole: true,
      mangle: {
        topLevel: true,
        keepFnName: true
      }
    })
  ].filter(Boolean),
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
    extensions: ['.jsx', '.js']
  }
};
