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
    className: 'content',

    events: {
      'keyup #search-box'    : 'onKeyup',
    },

    initialize: function() {
      _.bindAll(this, 'render','onSearch');
      this.template = _.template(searchHeaderTemplate);
    },

    render: function() {
      var initialQuery = this.options.query ? this.options.query : "";
      $(this.el).html(this.template({ query: initialQuery }));
      return this;
    },

    onSearch: function() {
      var query = $.trim(this.$('#search-box').val()).toLowerCase();
      if (query === '') {
        return;
      }
      BackBone.history.navigate(query, false);
      console.log('searching for ' + query);
      var searchfn = function(model) {
        // BEGIN GLORIOUS SEARCH ALGORITHM
        return model.get('title').match(query);
        // END GLORIOUS SEARCH ALGORITHM
      };
      this.collection.each(function(model) {
        model.set({visible: searchfn(model)});
      });

    },

    onKeyup: function(evt) {
      this.onSearch();
    },

  });

  return SearchHeaderView;
});
