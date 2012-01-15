define([
  'jQuery',
  'Underscore',
  'Backbone',
  'router',
], function($, _, Backbone, Router) {
  var initialize = function() {
    // c.f. http://appcachefacts.info/
    if (window.applicationCache) {
      window.applicationCache.addEventListener('updateready', function() {
        if (confirm('A new version of DocHub is available. Reload now?')) {
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
