const path = require('path')
const webpack = require('webpack')
const BabelMinifyPlugin = require('babel-minify-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

/* Environment */
const nodeEnv = process.env.NODE_ENV || 'development'
const DEVELOPMENT = nodeEnv === 'development'
const PRODUCTION = nodeEnv === 'production'

module.exports = {
  mode: nodeEnv,
  entry: [
    'regenerator-runtime/runtime',
    path.resolve(__dirname, 'src/index.js'),
  ],
  externals: {
    react: 'umd react',
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: `index.${nodeEnv}.js`,
    library: 'reactAdvancedForm',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      // 'process.env.NODE_ENV': JSON.stringify(nodeEnv),
      'process.env.BABEL_ENV': JSON.stringify(nodeEnv),
    }),

    // PRODUCTION &&
    //   new BabelMinifyPlugin({
    //     removeDebugger: true,
    //     removeConsole: true,
    //     mangle: {
    //       topLevel: true,
    //       exclude: {
    //         connectField: true,
    //         createField: true,
    //         FormProvider: true,
    //         Form: true,
    //         Field: true,
    //       },
    //     },
    //   }),

    // new BundleAnalyzerPlugin(),
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
              cacheDirectory: DEVELOPMENT,
            },
          },
          {
            loader: 'eslint-loader',
          },
        ],
      },
    ],
  },
  devtool: DEVELOPMENT && 'source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
}
