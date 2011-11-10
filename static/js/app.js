define([
  'jQuery',
  'Underscore',
  'Backbone',
  'router',
], function($, _, Backbone, Router) {
  var initialize = function() {
    Router.initialize();
  }

  return {
    initialize: initialize,
  };
});
