const aliases = require('./webpack.alias')

module.exports = ({ config }) => {
  config.resolve.alias = {
    ...config.resolve.alias,
    ...aliases,
  }

  return config
}
