// Filename: router.js
define([
  'libs/require/domReady-min!', // Use with the ! suffix (http://requirejs.org/docs/api.html#pageload)

  'jQuery',
  'Underscore',
  'Backbone',

  // Views
  'views/topnav',
  'views/searchheader',
  'views/tocbar',
  'views/searchresults',
  'views/fullwindow',

  // Models
  'models/mozdevcssprop',

  // Collections
  'collections/mozdevcssprops'
], function(doc, $, _, Backbone,
            TopNavView, SearchHeaderView, TOCView, SearchResultsView, FullWindowView,
            MozDevCSSProp,
            MozDevCSSPropCollection) {

  var InstaCSS = Backbone.Router.extend({
    routes: {
      ''         : 'main',
      ':query'   : 'main',
    },

    initialize: function() {
      // for client-side search...
      this.wholeFrigginDB = new MozDevCSSPropCollection();

      // todo: display a loading spinner or something while this is happening
      this.wholeFrigginDB.fetch({url: '/mozdevcssprop'});
    },

    main: function(query) {
      this.topNavView = new TopNavView();
      this.tocView = new TOCView({
        collection : this.wholeFrigginDB,
      });
      this.searchHeaderView = new SearchHeaderView({
        collection : this.wholeFrigginDB,
        query      : query
      });
      this.searchResultsView = new SearchResultsView({
        collection: this.wholeFrigginDB
      });

      // search needs to be triggered as soon as db is loaded (in case search box has an unhandled query)
      // also need to subscribe after searchresultsview...ew
      this.wholeFrigginDB.bind('reset',this.searchHeaderView.onSearch);

      // Save for convenience
      this.container = $('#container');

      $('#topnav').empty();
      $('#topnav').append(this.topNavView.render().el);
      $('#container').empty();
      $('#container').append(this.searchHeaderView.render().el);
      $('#container').append(this.tocView.render().el);
      $('#container').append(this.searchResultsView.render().el);
      $('#search-box').focus();

      this.fullWindow = new FullWindowView();
      this.wholeFrigginDB.bind('reset',this.fullWindow.onResize); // make sure toc well height is set correctly
    },

  });

  var initialize = function() {
    var mainApp = new InstaCSS();
    Backbone.history.start(); // can't do pushstate until we handle all routes on backend ({pushState: true});
  };

  return { initialize: initialize };
});
