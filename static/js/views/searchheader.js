define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/searchheader.html',
], function($, _, BackBone, searchHeaderTemplate) {

  // the header does not re-render on collection events
  // it just handles applying the query to the collection of models
  var SearchHeaderView = BackBone.View.extend({
    id: 'search-header',
    className: 'search-header',

    events: {
      'keyup #search-box'    : 'onSearch',
    },

    initialize: function() {
      _.bindAll(this, 'render','onSearch');
      this.template = _.template(searchHeaderTemplate);
      this.render();
    },

    render: function() {
      console.log('rendering search header');
      var initialQuery = this.options.query ? this.options.query : "";
      $(this.el).html(this.template({ query: initialQuery }));
      return this;
    },

    onSearch: function() {
      var query = $.trim(this.$('#search-box').val()).toLowerCase();

      // todo: replacestate...
      BackBone.history.navigate(query, false);

      if (query === '') {
        query = '.';
      }
      console.log('searching for ' + query);
      var searchfn = function(model) {
        // BEGIN GLORIOUS SEARCH ALGORITHM
        return model.get('title').match(query) !== null;
        // END GLORIOUS SEARCH ALGORITHM
      };
      this.collection.each(function(model) {
        model.set({visible: searchfn(model)});
      });

    },

  });

  return SearchHeaderView;
});
