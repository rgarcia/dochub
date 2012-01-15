define([
  'jQuery',
  'Underscore',
  'Backbone',
  'router',
], function($, _, Backbone, Router) {
  var initialize = function() {
    // c.f. http://www.html5rocks.com/en/tutorials/appcache/beginner/
    window.applicationCache.addEventListener('updateready', function(e) {
      // Browser downloaded a new app cache.
      // Swap it in and reload the page to get the new hotness.
      window.applicationCache.swapCache();
      if (confirm('A new version of this DocHub is available. Load it?')) {
        window.location.reload();
      }
    }, false);
    
    Router.initialize();
  }

  return {
    initialize: initialize,
  };
});
