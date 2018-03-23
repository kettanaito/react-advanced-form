const path = require('path');
const webpack = require('webpack');
const BabelMinifyPlugin = require('babel-minify-webpack-plugin');
const packageJson = require('./package.json');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/* Environment */
const DEVELOPMENT = (process.env.NODE_ENV === 'development');
const PRODUCTION = (process.env.NODE_ENV === 'production');

module.exports = {
  entry: [
    'regenerator-runtime/runtime',
    path.resolve(__dirname, packageJson.module)
  ],
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
      removeDebugger: true,
      removeConsole: true,
      mangle: {
        topLevel: true,
        exclude: {
          'connectField': true,
          'createField': true,
          'FormProvider': true,
          'Form': true,
          'Field': true,
          'Condition': true
        }
      }
    }),
    new BundleAnalyzerPlugin()
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: DEVELOPMENT
            }
          },
          {
            loader: 'eslint-loader'
          }
        ]
      }
    ]
  },
  devtool: DEVELOPMENT && 'source-map',
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
