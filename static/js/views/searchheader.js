define([
  'jQuery',
  'Underscore',
  'Backbone',
], function($, _, Backbone) {

  // the header does not re-render on collection events
  // it just handles applying the query to the collection of models
  var SearchHeaderView = Backbone.View.extend({
    events: {
      'keyup #search-box': 'onSearch',
    },

    initialize: function() {
      _.bindAll(this, 'render', 'removeBindings', 'onSearch');

      this.placeholder  = this.options.placeholder;
      this.languageName = this.options.languageName.toLowerCase();
      this.lastQuery = null;
    },

    removeBindings: function() {
      $(this.el).undelegate();
    },

    render: function() {
      var initialQuery = this.options.query ? this.options.query : "";
      this.$('#search-box').attr({
        'value'       : initialQuery,
        'placeholder' : this.placeholder
      });

      return this;
    },

    onSearch: _.debounce(function(evt) {
      var query = $.trim(this.$('#search-box').val()).toLowerCase();
      var queryExists = (query !== '');
      if (queryExists && query === this.lastQuery) {
        return;
      }
      this.lastQuery = query;

      // TODO: replacestate...
      Backbone.history.navigate(this.languageName + '/' + query, false);

      if (!queryExists) {
        // No query, so can do some optimizations.
        //  1. Don't use the search function
        //  2. Set tocVisibile: true, mainVisible: false
        this.collection.each(function(model) {
          model.set({ tocVisible: true, mainVisible: false });
        });
      } else {
        console.log('searching for ' + query);

        query = new RegExp(query);
        var searchfn = function(model) {
          // BEGIN GLORIOUS SEARCH ALGORITHM
          return query.test(model.get('lowerCaseTitle'));
          // END GLORIOUS SEARCH ALGORITHM
        };
        var self = this;
        this.collection.each(function(model) {
          var visible = searchfn(model);
          model.set({ tocVisible: visible, mainVisible: visible });
        });
      }
    }, 100),

  });

  return SearchHeaderView;
});

