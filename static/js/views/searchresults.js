define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/searchresults.html',
], function($, _, BackBone, searchResultsTemplate) {

  // the results view is just tied to a collection and re-renders itself
  var SearchResultsView = BackBone.View.extend({
    tagName: 'div',
    id: 'search-results',

    initialize: function() {
      _.bindAll(this, 'render');
      this.template = _.template(searchResultsTemplate);
      this.collection.bind('reset', this.render);
    },

    render: function() {
      $(this.el).html(this.template({ _:_, cssprops: this.collection }));
      return this;
    },
  });

  return SearchResultsView;
});
