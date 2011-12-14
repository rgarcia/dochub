var requirejs = require('requirejs');

requirejs.config({
  // Pass the top-level main.js/index.js require
  // function to requirejs so that node modules
  // are loaded relative to the top-level JS file.
  nodeRequire: require
});

requirejs([
  'app',
  'io'
], function(app, io) {
  app.initialize();
  io.initialize(app.getApp());
});
