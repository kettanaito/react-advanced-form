const path = require('path');
const webpack = require('webpack');
const BabelMinifyPlugin = require('babel-minify-webpack-plugin');
const packageJson = require('./package.json');

/* Environment */
const DEVELOPMENT = (process.env.NODE_ENV === 'development');
const PRODUCTION = (process.env.NODE_ENV === 'production');

module.exports = {
  entry: path.resolve(__dirname, packageJson.module),
  externals: {
    react: 'umd react',
    immutable: 'umd immutable'
  },
  output: {
    path: __dirname,
    filename: packageJson.main,
    library: 'reactAdvancedForm',
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
        include: `${__dirname}/src`,
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
