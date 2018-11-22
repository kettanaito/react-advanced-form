const path = require('path')
const webpack = require('webpack')
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
    filename: `index.js`,
    library: 'reactAdvancedForm',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    /**
     * UMD modules refer to "window", which breaks SSR.
     * @see https://github.com/webpack/webpack/issues/6522
     */
    globalObject: `typeof self !== 'undefined' ? self : this`,
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BABEL_ENV': JSON.stringify(nodeEnv),
    }),
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
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
}
