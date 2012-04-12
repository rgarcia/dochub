define([
  'jQuery',
  'Underscore',
  'Backbone',
  'views/searchresults'
], function($, _, BackBone, SearchResultsView) {

  // the results view is just tied to a collection and re-renders itself
  var PageSearchResultsView = SearchResultsView.extend({

    events: {
      'click a' : 'onClickAnchor'
    },

    initialize: function() {
      _.bindAll(this, 'render', 'startSpinner', 'onClickAnchor');
      this.collection.bind('reset', this.render);
      this.$searchResults = $('#search-results');
    },

    onClickAnchor: function(evt) {
      if (e.button > 0)
        return;
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey)
        return;

      var $anchor = this.$(evt.currentTarget);
      var href = $anchor.attr('href');

      if (href.charAt(0) === '#') {
        // Internal link
        var searchResultsTopVal = this.$searchResults.scrollTop();
        var topVal = $('#' + href).offset().top; // ID selection is the fastest
        this.$searchResults.scrollTop(searchResultsTopVal + topVal - 60);
        evt.stopPropagation();
        evt.preventDefault();
      }
    },

  });

  return PageSearchResultsView;
});

