const path = require('path')
const cwd = process.cwd()
const nodeEnv = process.env.NODE_ENV

module.exports = {
  mode: nodeEnv,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'raw-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      'react-advanced-form': path.resolve(__dirname, '../lib'),
      '@root': path.resolve(__dirname, '../'),
      '@examples': path.resolve(__dirname, '../examples'),
    },
  },
}
