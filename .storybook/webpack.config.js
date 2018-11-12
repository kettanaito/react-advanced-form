// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.
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
