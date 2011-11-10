// Filename: router.js
define([
  'libs/require/domReady-min!', // Use with the ! suffix (http://requirejs.org/docs/api.html#pageload)

  'jQuery',
  'Underscore',
  'Backbone',

  // Views
  'views/topnav',
  'views/searchheader',
  'views/searchresults',

  // Models
  'models/cssprop',

  // Collections
  'collections/cssprops'
], function(doc, $, _, Backbone,
            TopNavView, SearchHeaderView, SearchResultsView,
            CSSProp,
            CSSPropCollection) {

  var Abakan = Backbone.Router.extend({
    routes: {
      ''          : 'main',
    },

    initialize: function() {
      // for client-side search...
      this.wholeFrigginDB = new CSSPropCollection();
      this.wholeFrigginDB.fetch({url: '/cssprop'});
    },

    main: function() {
      this.topNavView = new TopNavView();
      this.searchHeaderView = new SearchHeaderView({
        collection : this.wholeFrigginDB
      });
      this.searchResultsView = new SearchResultsView({
        collection: this.wholeFrigginDB
      });

      // Save for convenience
      this.container = $('#container');

      $('#topnav').append(this.topNavView.render().el);
      $('#container').empty();
      $('#container').append(this.searchHeaderView.render().el);
      $('#container').append(this.searchResultsView.render().el);
      $('#search-box').focus();
    },
  });

  var initialize = function() {
    var mainApp = new Abakan();
    Backbone.history.start(); // can't do pushstate until we handle all routes on backend ({pushState: true});
  };

  return { initialize: initialize };
});
