var config = require('@shinnn/eslint-config');
var objectAssign = require('object-assign');

objectAssign(config.env, {
  browser: false,
  worker: false,
  serviceworker: false
});

module.exports = config;
