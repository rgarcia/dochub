define([
  'jQuery',
  'Underscore',
  'Backbone',
  'router',
], function($, _, Backbone, Router) {
  var initialize = function() {
    // c.f. http://appcachefacts.info/
    if (window.applicationCache) {
      applicationCache.addEventListener('updateready', function() {
        if (confirm('An update is available. Reload now?')) {
          window.location.reload();
        }
      });
    }

    Router.initialize();
  }

  return {
    initialize: initialize,
  };
});
