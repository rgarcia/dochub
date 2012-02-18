define([
  'jQuery',
  'Underscore',
  'Backbone',
], function($, _, Backbone) {

  var DEFAULT_SEARCH_DEBOUNCE_MS = 100;

  // the header does not re-render on collection events
  // it just handles applying the query to the collection of models
  var SearchHeaderView = Backbone.View.extend({

    initialize: function() {
      _.bindAll(this, 'render', 'addBindings', 'removeBindings', 'searchFunc');

      this.placeholder  = this.options.placeholder;
      this.languageName = this.options.languageName.toLowerCase();
      this.lastQuery = null;

      this.debounceTime = this.options.debounceTime
        ? this.options.debounceTime
        : DEFAULT_SEARCH_DEBOUNCE_MS;
      this.onSearch = _.debounce(this.searchFunc, this.debounceTime);
      _.bindAll(this, 'onSearch');

      this.$searchBox = $('#search-box');
      this.addBindings();
    },

    addBindings: function() {
      this.$searchBox.bind('keyup', this.onSearch);
    },

    removeBindings: function() {
      this.$searchBox.unbind();
    },

    render: function() {
      var initialQuery = this.options.query ? this.options.query : "";
      this.$('#search-box').attr({
        'value'       : initialQuery,
        'placeholder' : this.placeholder
      });

      return this;
    },

    searchFunc: function() {
      var query = $.trim(this.$searchBox.val()).toLowerCase();

      Backbone.history.navigate(this.languageName + '/' + query,
                                {trigger: false, replace: true});

      // Do this after we set url
      var queryExists = (query !== '');
      if (queryExists && query === this.lastQuery) {
        return;
      }
      this.lastQuery = query;

      if (!queryExists) {
        // No query, so can do some optimizations.
        //  1. Don't use the search function
        //  2. Set tocVisibile: true, mainVisible: false
        this.collection.each(function(model) {
          model.set({ tocVisible: true, mainVisible: false });
        });
      } else {
        console.log('[Searching for ' + query + '.]');

        query = new RegExp(query);
        this.collection.each(function(model) {
          var visible = query.test(model.get('lowerCaseTitle'));
          model.set({ tocVisible: visible, mainVisible: visible });
        });
      }
    },
  });

  return SearchHeaderView;
});

