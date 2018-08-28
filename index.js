'use strict'

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/index.development.js')
} else {
  module.exports = require('./lib/index.production.js')
}
