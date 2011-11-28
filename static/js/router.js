// Filename: router.js
define([
  'libs/require/domReady-min!', // Use with the ! suffix (http://requirejs.org/docs/api.html#pageload)

  'jQuery',
  'Underscore',
  'Backbone',

  // Views
  'views/topnav',
  'views/tocbar',
  'views/searchheader',
  'views/searchresults',
  'views/fullwindow',

  // Templates
  'text!templates/tocresult.html',
  'text!templates/mozdevcssprop.html',

  // Models
  'models/mozdevcssprop',

  // Collections
  'collections/mozdevcssprops'
], function(doc, $, _, Backbone,
            TopNavView, TOCBarView, SearchHeaderView, SearchResultsView, FullWindowView,
            TocResultTemplate, FullResultTemplate,
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

      this.wholeFrigginDB.fetch({url: '/mozdevcssprop'});
      this.wholeFrigginDB.bind('reset',function() { console.log('reset!'); });
    },

    main: function(query) {
      this.topNavView = new TopNavView();
      $('#topnav').empty();
      $('#topnav').append(this.topNavView.el);

      this.tocBarView = new TOCBarView({
        el: $('#toc'),
        collection: this.wholeFrigginDB
      });
      this.tocBarView.render();

      this.searchHeaderView = new SearchHeaderView({
        el: this.tocBarView.$('#search-header'),
        collection: this.wholeFrigginDB,
        query: query
      });
      this.searchHeaderView.render();

      this.tocResultsView = new SearchResultsView({
        el: this.tocBarView.$('#toc-results'),
        collection: this.wholeFrigginDB,
        itemTemplate: TocResultTemplate,
        visibleField: 'tocVisible'
      });

      this.mainResultsView = new SearchResultsView({
        el: $('#search-results'),
        collection: this.wholeFrigginDB,
        itemTemplate: FullResultTemplate,
        visibleField: 'mainVisible',
        spinner: true
      });

      // search needs to be triggered as soon as db is loaded in case search box
      // has an unhandled query. also need to wait to do this until after
      // results have rendered (which happens on reset).
      this.wholeFrigginDB.bind('reset', this.searchHeaderView.onSearch);

      this.fullWindow = new FullWindowView();
      // make sure toc well height is set correctly (TODO: move this into tocbarview)
      this.wholeFrigginDB.bind('reset',this.fullWindow.onResize);

      $('#search-box').focus();
    },
  });

  var initialize = function() {
    var mainApp = new InstaCSS();
    Backbone.history.start(); // can't do pushstate until we handle all routes on backend ({pushState: true});
  };

  return { initialize: initialize };
});

