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
      _.bindAll(this, 'render', 'onSearch');
    },

    render: function() {
      console.log('rendering search header');

      var initialQuery = this.options.query ? this.options.query : "";
      this.$('#search-box').attr({'value': initialQuery });

      return this;
    },

    onSearch: function(evt) {
      console.log('onSearch');
      var query = $.trim(this.$('#search-box').val()).toLowerCase();

      // TODO: replacestate...
      Backbone.history.navigate(query, false);

      var queryExists = (query !== '');
      if (!queryExists) {
        // No query, so can do some optimizations.
        //  1. Don't use the search function
        //  2. Set tocVisibile: true, mainVisible: false
        var self = this;
        this.collection.each(function(model) {
          model.set({ tocVisible  : true, mainVisible : false });
        });
      } else {
        console.log('searching for ' + query);

        query = new RegExp(query, 'i'); // Ignore case
        var searchfn = function(model) {
          // BEGIN GLORIOUS SEARCH ALGORITHM
          return query.test(model.get('htmlEscapedTitle'));
          // END GLORIOUS SEARCH ALGORITHM
        };
        var self = this;
        this.collection.each(function(model) {
          var visible = searchfn(model);
          model.set({ tocVisible: visible, mainVisible: visible });
        });
      }
    },

  });

  return SearchHeaderView;
});

