'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/index.production.js');
} else {
  module.exports = require('./lib/index.development.js');
}
