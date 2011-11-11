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
  'models/mozdevcssprop',

  // Collections
  'collections/mozdevcssprops'
], function(doc, $, _, Backbone,
            TopNavView, SearchHeaderView, SearchResultsView,
            MozDevCSSProp,
            MozDevCSSPropCollection) {

  var InstaCSS = Backbone.Router.extend({
    routes: {
      ''          : 'main',
    },

    initialize: function() {
      // for client-side search...
      this.wholeFrigginDB = new MozDevCSSPropCollection();

      // todo: display a loading spinner or something while this is happening
      this.wholeFrigginDB.fetch({url: '/mozdevcssprop'});
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
    var mainApp = new InstaCSS();
    Backbone.history.start(); // can't do pushstate until we handle all routes on backend ({pushState: true});
  };

  return { initialize: initialize };
});
